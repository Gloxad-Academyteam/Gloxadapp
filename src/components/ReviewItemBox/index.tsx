import Button from "@components/Button";
import ImageComponent from "@components/ImageComponent/ImageComponent";
import Stars from "@components/Stars/Stars";
import { MdOutlineThumbDownAlt, MdOutlineThumbUpAlt } from "react-icons/md";
import useReviewItemBox from "./hooks/useReviewItemBox";
import useModal from "@hooks/useModal";
import Modal from "@components/Modal";
import ModalContent from "@components/ModalContent";
import ReportModalContent from "@components/ReportModalContent";

type TProps = {
  rating: number;
  imageSrc: string;
  userName: string;
  date: string;
  review: string;
};

const ReviewItemBox = ({
  rating,
  imageSrc,
  userName,
  date,
  review,
}: TProps) => {
  const { isUpVoteLoading, handleUpVote, isDownVoteLoading, handleDownVote } =
    useReviewItemBox();

  const { isModalOpen, handleToggleModal } = useModal(false);

  return (
    <div className="p-[24px] w-[344px] rounded-[8px] p-6 border border-neutral-4 bg-primary-1 flex flex-col items-center justify-center gap-[16px]">
      {isModalOpen && (
        <Modal>
          <ModalContent toggleModal={handleToggleModal}>
            <ReportModalContent onCancelClick={handleToggleModal} />
          </ModalContent>
        </Modal>
      )}

      <div className="flex gap-[8px] w-full items-center">
        <ImageComponent
          src={imageSrc}
          alt={userName}
          width="46px"
          height="46px"
          isRound
        />

        <div className="flex flex-col gap-[4px]">
          <p className="font-medium text-title-small">{userName}</p>

          <div className="flex gap-[4px]">
            <Stars rating={rating} />
            <p className="font-medium text-label-medium text-neutral-8">
              {date}
            </p>
          </div>
        </div>
      </div>

      <p className="text-neutral-8 text-body-large">{review}</p>

      <div className="flex items-center justify-between w-full">
        <div className="flex">
          <div>
            <Button
              ghost
              Icon={MdOutlineThumbUpAlt}
              isRound
              disabled={isUpVoteLoading}
              testID="upvote"
              onClick={handleUpVote}
            />
            {isUpVoteLoading && <div data-testid="loading"></div>}
          </div>

          <div>
            <Button
              ghost
              Icon={MdOutlineThumbDownAlt}
              isRound
              disabled={isDownVoteLoading}
              testID="downvote"
              onClick={handleDownVote}
            />
            {isDownVoteLoading && <div data-testid="loading"></div>}
          </div>
        </div>

        <Button text="Report" ghost onClick={handleToggleModal} />
      </div>
    </div>
  );
};

export default ReviewItemBox;
