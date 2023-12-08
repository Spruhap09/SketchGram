import noAvatar from 'public/noAvatar.jpeg'

const ProfileHeader = ({profile}) => {
    return (
        <div className="profile-header">
          <img src={noAvatar.src} alt={profile.name} className="profile-picture" />
          <h1>{profile.name}</h1>
          <h2>{profile.location}</h2>
          <div className="stats">
            <span>{profile.photos} Photos</span>
            <span>{profile.followers} Followers</span>
            <span>{profile.following} Following</span>
          </div>
          <button>Edit Profile</button>
        </div>
      );
}

export default ProfileHeader