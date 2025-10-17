// register form
export type RegisterFormUser = {
  name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
};

// Login form user
export type LoginFormUser = {
  email: string;
  password: string;
};

// User
export type User = {
  username: string;
  email: string;
  image_path: string;
  last_name: string;
  id: number;
  name: string;
  last_message: string;
  last_message_at: string;
  last_message_from_id: number;
  is_admin: number;
};

// Edited User Form
export type EditedUser = {
  name: string;
  last_name: string;
  username: string;
  password: string;
  password_confirmation: string;
};

// logged user
export type LoggedUser = {
  auth_token: string;
  email: string;
  name: string;
  last_name: string;
  image_path: string;
  username: string;
  id: number;
};

export type ForgotPassField = {
  email: string;
};

// Reset user obj
export type ResetUserObj = {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
};

// Message
export type Message = {
  data: {
    created_at: string;
    from: {
      id: number;
      image_path: string;
      name: string;
    };
    from_id: number;
    id: number;
    message: string;
    read_at: null;
    to: { id: number; image_path: string; name: string };
    to_id: number;
    updated_at: string;
  };
  status: string;
};

// Chat Message
export type ChatMessage = {
  created_at: string;
  from: {
    id: number | undefined;
    image_path: string | undefined;
    name: string | undefined;
  };
  from_id: number | undefined;
  id: number | string;
  message: string;
  read_at: null;
  to: {
    id: number | undefined;
    image_path: string | undefined;
    name: string | undefined;
  };
  to_id: number;
  updated_at: string | undefined;
  confirmed?: boolean;
};

// Live Message
export type LiveMessage = {
  from_id: number;
  message: string;
  to_id: number;
  id?: string | number;
};

// Fetch Messages
export type Messages = {
  data: {
    contact: {
      created_at: string;
      email: string;
      email_verified_at: null;
      id: number;
      image_path: string;
      is_admin: number;
      last_name: string;
      name: string;
      updated_at: string;
      username: string;
    };
    messages: ChatMessage[];
  };
  message: string;
  status: string;
};

// Edit other user type
export type EditUserForm = {
  username: string;
};
