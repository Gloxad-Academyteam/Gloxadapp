"use client";

import UserAvatar from "@components/Avatar";
import { useEffect, useMemo, useRef, useState } from "react";
import { Participant, Room, RoomEvent, Track } from "livekit-client";
import { MdCallEnd, MdMic, MdMicOff, MdOutlineScreenShare, MdOutlineStopScreenShare, MdVideocam, MdVideocamOff } from "react-icons/md";
import type { TRoomCredentials } from "@services/lms";

export type TRoomPerson = { identity: string; name: string; canPublish: boolean; isYou: boolean };

type TProps = {
  credentials: TRoomCredentials;
  onLeave: () => void;
  // Everyone currently in the room, for the People tab
  onPeople?: (people: TRoomPerson[]) => void;
};

type TStatus = "connecting" | "connected" | "failed";

// One video element fed by a LiveKit track
const TrackVideo = ({ participant, source, muted }: { participant: Participant; source: Track.Source; muted?: boolean }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const track = participant.getTrackPublication(source)?.videoTrack;
  useEffect(() => {
    const element = ref.current;
    if (!element || !track) return undefined;
    track.attach(element);
    return () => {
      track.detach(element);
    };
  }, [track]);
  if (!track) return null;
  return <video ref={ref} autoPlay playsInline muted={muted} className="h-full w-full object-contain" />;
};


const ControlButton = ({ label, active, danger, onClick, children }: { label: string; active?: boolean; danger?: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    aria-pressed={active}
    onClick={onClick}
    className={`flex h-11 w-11 items-center justify-center rounded-full text-white transition ${danger ? "bg-[#d62828] hover:bg-[#b81f1f]" : active ? "bg-white/25 hover:bg-white/35" : "bg-[#4a1f1f] hover:bg-[#5d2727]"}`}
  >
    {children}
  </button>
);

const LiveRoomStage = ({ credentials, onLeave, onPeople }: TProps) => {
  const room = useMemo(() => new Room({ adaptiveStream: true, dynacast: true }), []);
  const audioHost = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<TStatus>("connecting");
  const [error, setError] = useState("");
  const [, setTick] = useState(0);
  const [controlError, setControlError] = useState("");
  const isHost = credentials.role === "host";

  useEffect(() => {
    let cancelled = false;
    const refresh = () => setTick((value) => value + 1);
    const container = audioHost.current;

    // Sound from other people is played through hidden audio elements
    room.on(RoomEvent.TrackSubscribed, (track) => {
      if (track.kind === Track.Kind.Audio && container) container.appendChild(track.attach());
      refresh();
    });
    room.on(RoomEvent.TrackUnsubscribed, (track) => {
      track.detach().forEach((element) => element.remove());
      refresh();
    });
    for (const event of [RoomEvent.ParticipantConnected, RoomEvent.ParticipantDisconnected, RoomEvent.TrackMuted, RoomEvent.TrackUnmuted, RoomEvent.LocalTrackPublished, RoomEvent.LocalTrackUnpublished, RoomEvent.TrackPublished, RoomEvent.TrackUnpublished]) {
      room.on(event, refresh);
    }
    room.on(RoomEvent.Disconnected, () => {
      if (!cancelled) {
        setStatus("failed");
        setError("You were disconnected from the class.");
      }
    });

    room
      .connect(credentials.serverUrl, credentials.roomToken)
      .then(async () => {
        if (cancelled) return;
        setStatus("connected");
        await room.startAudio().catch(() => undefined);
        refresh();
      })
      .catch((reason: unknown) => {
        if (cancelled) return;
        setStatus("failed");
        setError(reason instanceof Error && reason.message ? reason.message : "We could not connect to the class video.");
      });

    return () => {
      cancelled = true;
      room.removeAllListeners();
      container?.replaceChildren();
      void room.disconnect();
    };
  }, [room, credentials]);

  const people: Participant[] = status === "connected" ? [room.localParticipant, ...Array.from(room.remoteParticipants.values())] : [];
  useEffect(() => {
    onPeople?.(people.map((person) => ({ identity: person.identity, name: person.name || "Participant", canPublish: Boolean(person.permissions?.canPublish), isYou: person === room.localParticipant })));
    // The list changes when someone joins or leaves, which re-renders this component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [people.map((person) => person.identity).join(",")]);

  // The stage shows a shared screen if there is one, otherwise whoever is publishing video
  const screen = people.find((person) => person.getTrackPublication(Track.Source.ScreenShare)?.videoTrack);
  const camera = people.find((person) => person.getTrackPublication(Track.Source.Camera)?.videoTrack && (person.permissions?.canPublish ?? true));
  const speaker = screen ?? camera;
  const speakerSource = screen ? Track.Source.ScreenShare : Track.Source.Camera;
  const thumbnails = people.filter((person) => person !== speaker && person.getTrackPublication(Track.Source.Camera)?.videoTrack);

  const toggle = async (action: () => Promise<unknown>) => {
    setControlError("");
    try {
      await action();
      setTick((value) => value + 1);
    } catch (reason) {
      setControlError(reason instanceof Error && reason.message ? reason.message : "That did not work. Check your browser permissions.");
    }
  };
  const local = room.localParticipant;

  return (
    <div className="relative flex aspect-video w-full flex-col overflow-hidden rounded-[18px] bg-[#1b2230] shadow-[0_20px_50px_-24px_rgba(20,20,80,0.5)]">
      <div ref={audioHost} aria-hidden className="hidden" />

      {status === "connecting" && <div className="absolute inset-0 flex items-center justify-center text-[15px] text-white/80">Connecting to the class...</div>}
      {status === "failed" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-white">
          <p className="text-[18px] font-bold">We could not connect to the class video</p>
          <p className="max-w-[420px] text-[14px] text-white/75">{error || "Check your connection and try again."}</p>
          <button type="button" onClick={onLeave} className="rounded-full bg-white px-5 py-2 text-[14px] font-semibold text-[#14162b]">Back</button>
        </div>
      )}

      {status === "connected" && (
        <>
          <div className="relative flex-1">
            {speaker ? (
              <TrackVideo participant={speaker} source={speakerSource} muted={speaker === local} />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-white">
                <UserAvatar className="h-16 w-16" placeholderClassName="bg-white/15 text-white/70" />
                <p className="text-[16px] font-semibold">{isHost ? "Turn on your camera to begin" : "Waiting for the tutor's video"}</p>
                <p className="text-[13px] text-white/70">{people.length} {people.length === 1 ? "person is" : "people are"} in the room</p>
              </div>
            )}
            {speaker && <span className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-[12px] font-semibold text-white">{screen ? `${screen.name || "Tutor"} is sharing a screen` : speaker.name || "Tutor"}</span>}
            {thumbnails.length > 0 && (
              <div className="absolute bottom-3 right-3 flex max-w-[60%] gap-2 overflow-x-auto">
                {thumbnails.map((person) => (
                  <div key={person.identity} className="relative h-[78px] w-[120px] shrink-0 overflow-hidden rounded-[10px] bg-black ring-1 ring-white/20">
                    <TrackVideo participant={person} source={Track.Source.Camera} muted={person === local} />
                    <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 text-[10.5px] text-white">{person === local ? "You" : person.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-3 bg-black/35 px-4 py-3">
            {isHost && (
              <>
                <ControlButton label={local.isMicrophoneEnabled ? "Mute microphone" : "Unmute microphone"} active={local.isMicrophoneEnabled} onClick={() => toggle(() => local.setMicrophoneEnabled(!local.isMicrophoneEnabled))}>
                  {local.isMicrophoneEnabled ? <MdMic size={22} /> : <MdMicOff size={22} />}
                </ControlButton>
                <ControlButton label={local.isCameraEnabled ? "Turn camera off" : "Turn camera on"} active={local.isCameraEnabled} onClick={() => toggle(() => local.setCameraEnabled(!local.isCameraEnabled))}>
                  {local.isCameraEnabled ? <MdVideocam size={22} /> : <MdVideocamOff size={22} />}
                </ControlButton>
                <ControlButton label={local.isScreenShareEnabled ? "Stop sharing your screen" : "Share your screen"} active={local.isScreenShareEnabled} onClick={() => toggle(() => local.setScreenShareEnabled(!local.isScreenShareEnabled))}>
                  {local.isScreenShareEnabled ? <MdOutlineStopScreenShare size={22} /> : <MdOutlineScreenShare size={22} />}
                </ControlButton>
              </>
            )}
            <ControlButton label="Leave the class" danger onClick={onLeave}>
              <MdCallEnd size={22} />
            </ControlButton>
          </div>
          {controlError && <p role="alert" className="bg-[#7a1d14] px-4 py-1.5 text-center text-[12.5px] text-white">{controlError}</p>}
        </>
      )}
    </div>
  );
};

export default LiveRoomStage;
