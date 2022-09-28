import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Segment } from "semantic-ui-react";
import {
  fetchImages,
  getMorePagesAvailable,
  getAllImages,
  getUnsplashError,
  isUnsplashLoading,
  resetSearch,
  getSearchTerms,
} from "./unsplashSlice";
import {
  addLike,
  fetchAllLikes,
  getAllLikes,
  removeLike,
} from "../pixlikes/pixlikesSlice";
import "./UnsplashDiscover.css";
import useAuth from "../auth/useAuth";
import ErrorMessage from "../../components/ErrorMessage";
import InfiniteScroll from "../../components/InfiniteScroll";
import UnsplashSearchBar from "./UnsplashSearchBar";

const UnsplashDiscover = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const images = useSelector(getAllImages);
  const error = useSelector(getUnsplashError);
  const loading = useSelector(isUnsplashLoading);
  const likes = useSelector(getAllLikes);
  const terms = useSelector(getSearchTerms);
  const userId = user?.id || 0;
  const navigate = useNavigate();

  const moreToLoad = useSelector(getMorePagesAvailable);

  const isImageLiked = (image) => image in likes;
  const onLikeToggle = (image) => {
    if (userId !== 0) {
      if (isImageLiked(image.id)) {
        return dispatch(
          removeLike({
            userId: userId,
            image_id: image.id,
          })
        );
      }
      return dispatch(
        addLike({
          userId: userId,
          image: image,
        })
      );
    } else {
      navigate("/login");
    }
  };

  const onScrollLimit = () => dispatch(fetchImages());

  useEffect(() => {
    dispatch(fetchAllLikes({ userId: userId }));
  }, [userId, dispatch]);

  const onEnterPressed = (terms) => {
    dispatch(resetSearch(terms));
    dispatch(fetchImages());
  };

  return (
    <Segment textAlign="center" className="darkSegment">
      <Grid
        textAlign="center"
        stackable={true}
        style={{
          padding: "1em 0em",
        }}
      >
        <Grid.Row style={{ height: "80px" }}>
          <Grid.Column>
            <Container text>
              <UnsplashSearchBar
                size="large"
                value={terms}
                onEnter={onEnterPressed}
              />
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <>
        {error ? (
          <ErrorMessage
            icon="plug"
            header="We are experiencing an error fetching images from Unsplash API"
            content={
              error ||
              "Please retry later, when the limitations of the development API key will be lifted."
            }
          />
        ) : (
          <InfiniteScroll
            images={images}
            moreToLoad={moreToLoad}
            loading={loading}
            onScrollLimit={onScrollLimit}
            isImageLiked={isImageLiked}
            onLikeToggle={onLikeToggle}
            showLikeButton
          />
        )}
      </>
    </Segment>
  );
};

export default UnsplashDiscover;
