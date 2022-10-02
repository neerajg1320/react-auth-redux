import {useDispatch, useSelector} from 'react-redux'
import '../styles/profile.css'
import {useEffect} from "react";
import {getUserDetails} from "../features/user/userSlice";

const ProfileScreen = () => {
  const { userInfo } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  // automatically authenticate user if token is found
  useEffect(() => {
    dispatch(getUserDetails())
  }, [dispatch])

  useEffect(() => {
    console.log(`ProfileScreen: userInfo=${JSON.stringify(userInfo)}`);

  }, [userInfo])
  return (
      <div>
        <figure>{userInfo?.username?.charAt(0).toUpperCase()}</figure>
        <span>
        Welcome <strong>{userInfo?.username}!</strong> You can view this page
        because you're logged in
      </span>
      </div>
  )
}
export default ProfileScreen