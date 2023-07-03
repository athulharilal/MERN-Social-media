import User from "../models/user.js";

// Read user by ID
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get user's friends
export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friendPromises = user.Friends.map((friendId) => User.findById(friendId));
    const friends = await Promise.all(friendPromises);

    const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => ({
      _id,
      firstName,
      lastName,
      occupation,
      location,
      picturePath,
    }));

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Add or remove a friend
export const addRemoveFriend = async (req, res) => {
  try {
    const { id } = req.params;
    const { friendId } = req.body;

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.Friends.includes(friendId)) {
      user.Friends = user.Friends.filter((id) => id !== friendId);
      friend.Friends = friend.Friends.filter((id) => id !== id);
    } else {
      user.Friends.push(friendId);
      friend.Friends.push(id);
    }

    await user.save();
    await friend.save();

    const friendPromises = user.Friends.map((friendId) => User.findById(friendId));
    const friends = await Promise.all(friendPromises);

    const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => ({
      _id,
      firstName,
      lastName,
      occupation,
      location,
      picturePath,
    }));

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
