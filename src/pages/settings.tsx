/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editUser, uploadAvatar } from "../services/settingsServices";
import { EditedUser } from "../types/type";
import { updateLoggedInUser } from "../redux/slice";
import { showErrorToast, showSuccessToast } from "../components/toast";

const API_URL = import.meta.env.VITE_API_URL;

function Settings() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // React Form Hook
  const {
    register,
    handleSubmit,
    watch,

    formState: { errors },
  } = useForm<EditedUser>();
  const password = watch("password");

  //// Patch HTTP method Edit user
  const { mutate: editUserFormFields } = useMutation({
    mutationFn: ({ editedObj }: { editedObj: EditedUser }) =>
      editUser(editedObj),
    onSuccess: (data) => {
      console.log(data);
      // Update Redux logged user
      dispatch(updateLoggedInUser(data.data));

      // Osveži localStorage
      const storedUser = JSON.parse(
        localStorage.getItem("loggedInUser") || "{}"
      );
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({ ...storedUser, ...data.data })
      );

      queryClient.invalidateQueries({ queryKey: ["settings"] });
      showSuccessToast("User is updated!");
    },
    onError: () => {
      showErrorToast("Failed to update user");
    },
  });

  // React Query upload POST
  const { mutate: uploadMutate } = useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: (data) => {
      const newImagePath = data.data.image_path;
      console.log(newImagePath);

      // Update Redux
      dispatch(
        updateLoggedInUser({
          ...loggedUser,
          image_path: newImagePath,
        })
      );

      // Update localStorage
      const storedUser = JSON.parse(
        localStorage.getItem("loggedInUser") || "{}"
      );
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({ ...storedUser, image_path: newImagePath })
      );

      showSuccessToast("Avatar updated!");
    },
    onError: () => {
      showErrorToast("Failed to upload avatar");
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadMutate(file);
  }

  function onSubmit(data: EditedUser) {
    // console.log("Edited obj", data);
    editUserFormFields({
      editedObj: data,
    });
  }

  const loggedUser = useSelector((state: RootState) => state.auth.loggedInUser);
  // console.log("LOGGED USER", loggedUser);

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="img-wrapper">
            <img
              src={
                loggedUser?.image_path === "images/default.png"
                  ? `${API_URL}/${loggedUser.image_path}?t=${Date.now()}`
                  : `${API_URL}/storage/${
                      loggedUser?.image_path
                    }?t=${Date.now()}`
              }
              alt="Profilna slika"
            />

            <label className="edit-avatar">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {/* <span>
                                {isLoading ? "Uploading..." : "Change Image"}
                            </span> */}
              <span>Change Image</span>
            </label>
          </div>

          <div className="profile-info">
            <h2 className="name">{loggedUser?.name || "Ime Prezime"}</h2>
            <div className="email">
              {loggedUser?.email || "email@example.com"}
            </div>
            <div className="status">Available</div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
          <div className="form-row">
            <label>Name</label>
            <input
              type="text"
              defaultValue={loggedUser?.name || ""}
              {...register("name", {
                required: "Name is required",
              })}
            />
            {errors.name && <p className="error-text">{errors.name.message}</p>}
          </div>
          <div className="form-row">
            <label>Lastname</label>
            <input
              type="text"
              defaultValue={loggedUser?.last_name || ""}
              {...register("last_name", {
                required: "Lastname is required",
              })}
            />
            {errors.last_name && (
              <p className="error-text">{errors.last_name.message}</p>
            )}
          </div>
          <div className="form-row">
            <label>Username</label>
            <input
              type="text"
              defaultValue={loggedUser?.username || ""}
              {...register("username", {
                required: "Username is required",
              })}
            />
            {errors.username && (
              <p className="error-text">{errors.username.message}</p>
            )}
          </div>
          <div className="form-row">
            <label>Password</label>

            <input
              placeholder="Enter your password"
              type="password"
              {...register("password", {
                // required: "Password is required",
              })}
            />
            {/* {errors.password && (
              <p className="error-text">{errors.password.message}</p>
            )} */}
          </div>
          <div className="form-row">
            <label>Confirm Password</label>

            <input
              placeholder="Confirm your password"
              type="password"
              {...register("password_confirmation", {
                // required: "Please confirm password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {/* {errors.password_confirmation && (
              <p className="error-text">
                {errors.password_confirmation.message}
              </p>
            )} */}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              <span>Save</span>
            </button>
            <button type="button" className="btn-secondary">
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;
