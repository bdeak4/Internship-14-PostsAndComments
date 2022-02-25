function getCurrentUser() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    return null;
  }

  const user = await getApiResponse(`/user/${userId}`);
  console.log(user);
  return user;
}

export { getCurrentUser };
