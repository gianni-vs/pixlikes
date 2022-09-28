import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header, Segment } from "semantic-ui-react";
import {
  fetchImages,
  getMorePagesAvailable,
  getAllImages,
  isPixlikesLoading,
  getPixlikesError,
  removeLike,
  fetchUsers,
  getUserByID,
  getProfileUser,
  getSimilarUsers,
} from "./pixlikesSlice";
import "./ProfilePage.css";
import useAuth from "../auth/useAuth";
import HeaderWithIcon from "../../components/HeaderWithIcon";
import ErrorMessage from "../../components/ErrorMessage";
import { NavLink, useParams } from "react-router-dom";
import UsersList from "./UsersList";
import InfiniteScroll from "../../components/InfiniteScroll";

const ProfilePage = () => {
  const { user: loggedUser } = useAuth();

  const dispatch = useDispatch();
  const images = useSelector(getAllImages);
  const error = useSelector(getPixlikesError);
  const loading = useSelector(isPixlikesLoading);
  const profileUser = useSelector(getProfileUser);
  const discoverUsers = useSelector(getSimilarUsers);

  const params = useParams();
  const requestedUserId = params.userId || loggedUser.id;
  const ownProfile = requestedUserId === loggedUser.id;
  const isGuestProfile = !requestedUserId && loggedUser.id === 0;

  const moreToLoad = useSelector(getMorePagesAvailable);
  const onScrollLimit = () =>
    dispatch(fetchImages({ userId: requestedUserId }));

  const onLikeToggle = (image) => {
    dispatch(
      removeLike({
        userId: requestedUserId,
        image_id: image.unsplash_id,
      })
    );
  };

  useEffect(() => {
    dispatch(fetchImages({ userId: requestedUserId, page: 1 }));
    dispatch(fetchUsers({ id: requestedUserId }));
    if (!isGuestProfile) {
      dispatch(getUserByID({ userId: requestedUserId }));
    }
  }, [requestedUserId, dispatch, isGuestProfile]);

  if (isGuestProfile) {
    return (
      <Segment textAlign="center" className="darkSegment">
        <HeaderWithIcon title="Guest profile" icon="user secret" />
        <Header inverted as="h3" dividing>
          Find inspiring users
        </Header>
        <UsersList users={discoverUsers} />
        <Header inverted as="h3" dividing>
          Your likes
        </Header>
        <ErrorMessage
          color="grey"
          icon="sign in"
          header="Login to proceed"
          content={
            <p>
              To visit your own profile, <NavLink to="/login">login</NavLink> or{" "}
              <NavLink to="/signup">sign up</NavLink>
            </p>
          }
        />
      </Segment>
    );
  }

  return (
    <Segment textAlign="center" className="darkSegment">
      <>
        <HeaderWithIcon
          title={
            profileUser && profileUser.name
              ? profileUser.name + "'s profile"
              : ""
          }
          icon="user"
        />
        <Header inverted as="h3" dividing>
          Friends
        </Header>
        <UsersList users={discoverUsers} />
        <Header inverted as="h3" dividing>
          Liked images
        </Header>
        <>
          {loading && images?.length === 0 ? (
            <></>
          ) : error ? (
            <ErrorMessage content={error.message} />
          ) : (
            <>
              {images?.length > 0 ? (
                <InfiniteScroll
                  images={images}
                  moreToLoad={moreToLoad}
                  loading={loading}
                  onScrollLimit={onScrollLimit}
                  isImageLiked={() => true}
                  onLikeToggle={onLikeToggle}
                  showLikeButton={ownProfile}
                />
              ) : (
                <ErrorMessage
                  color="grey"
                  icon="images"
                  header="No images liked yet"
                  content={
                    ownProfile ? (
                      <p>
                        <NavLink to="/">Discover</NavLink> new pictures now
                      </p>
                    ) : (
                      profileUser.name + " did not like any image, yet!"
                    )
                  }
                />
              )}
            </>
          )}
        </>
      </>
    </Segment>
  );
};

export default ProfilePage;
