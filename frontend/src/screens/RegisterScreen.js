import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import Error from '../components/Error'
import { registerUser } from '../features/user/userSlice';

const RegisterScreen = () => {
  const { loading, error } = useSelector(
      (state) => state.user
  )
  const dispatch = useDispatch()

  const { register, handleSubmit } = useForm()

  const submitForm = (data) => {
    // check if passwords match
    if (data.password !== data.confirmPassword) {
      alert('Password mismatch')
      return
    }
    // transform email string to lowercase to avoid case sensitivity issues during login
    data.email = data.email.toLowerCase()
    dispatch(registerUser(data))
  }
  return (
      <form onSubmit={handleSubmit(submitForm)}>
        {/* render error message with Error component, if any */}
        {error && <Error>{error}</Error>}
        <div className='form-group'>
          <label htmlFor='username'>User Name</label>
          <input
              type='text'
              className='form-input'
              {...register('username')}
              required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='email'>Email</label>
          <input
              type='email'
              className='form-input'
              {...register('email')}
              required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <input
              type='password'
              className='form-input'
              {...register('password')}
              required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='email'>Confirm Password</label>
          <input
              type='password'
              className='form-input'
              {...register('confirmPassword')}
              required
          />
        </div>
        <button type='submit' className='button' disabled={loading}>
          Register
        </button>
      </form>
  )
}
export default RegisterScreen
