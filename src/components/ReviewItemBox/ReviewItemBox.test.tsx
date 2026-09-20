import { render, screen } from "@testing-library/react";
import createTestServer from "@utils/test/mocks/servers/createTestServer";
import ReviewItemBox from ".";
import userEvent from "@testing-library/user-event";
import { handleAssertLoadingState } from "@utils/test/assertUtils";
import TestProviders from "@components/Providers/TestProvider";
import {sendDownvoteServiceRoute, sendUpvoteServiceRoute} from "@services/vote";

describe("ReviewItemBox Vote Success", () => {
  createTestServer([
    {
      route: sendUpvoteServiceRoute,
    },
    {
      route: sendDownvoteServiceRoute,
    },
  ]);

  test("voting works as expected", async () => {
    render(
      <ReviewItemBox
        rating={3.1}
        imageSrc="https://picsum.photos/200"
        userName="John Doe"
        date="2 days ago"
        review="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis lorem ut libero malesuada feugiat."
      />,
      {
        wrapper: TestProviders,
      }
    );

    const user = userEvent.setup();

    const upvoteButton = screen.getByText(/upvote/i);
    await user.click(upvoteButton);

    expect(screen.queryByText(/upvote success/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/upvote failed! try again later/i)
    ).not.toBeInTheDocument();

    await handleAssertLoadingState(upvoteButton);

    expect(screen.getByText(/upvote success/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/upvote failed! try again later/i)
    ).not.toBeInTheDocument();


    const downvoteButton = screen.getByText(/downvote/i);
    await user.click(downvoteButton);

    expect(screen.queryByText(/downvote success/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/downvote failed! try again later/i)
    ).not.toBeInTheDocument();

    await handleAssertLoadingState(downvoteButton);

    expect(screen.getByText(/downvote success/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/downvote failed! try again later/i)
    ).not.toBeInTheDocument();
  });
});

describe("ReviewItemBox Vote Error", () => {
  createTestServer([
    {
      route: sendUpvoteServiceRoute, 
      isResponseError: true,
    },
    {
      route: sendDownvoteServiceRoute,
      isResponseError: true,
    },
  ]);

  test("voting works as expected", async () => {
    render(
      <ReviewItemBox
        rating={3.1}
        imageSrc="https://picsum.photos/200"
        userName="John Doe"
        date="2 days ago"
        review="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis lorem ut libero malesuada feugiat."
      />,
      {
        wrapper: TestProviders,
      }
    );

    const user = userEvent.setup();

    const upvoteButton = screen.getByText(/upvote/i);
    await user.click(upvoteButton);

    expect(
      screen.queryByText(/upvote failed! try again later/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/upvote success/i)).not.toBeInTheDocument();

    await handleAssertLoadingState(upvoteButton);

    expect(
      screen.getByText(/upvote failed! try again later/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/upvote success/i)).not.toBeInTheDocument();

    const downvoteButton = screen.getByText(/downvote/i);
    await user.click(downvoteButton);

    expect(
      screen.queryByText(/downvote failed! try again later/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/downvote success/i)).not.toBeInTheDocument();

    await handleAssertLoadingState(downvoteButton);

    expect(
      screen.getByText(/downvote failed! try again later/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/downvote success/i)).not.toBeInTheDocument();
  });
});
