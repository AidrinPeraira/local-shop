import React from 'react'
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ProfileContent  from '../../components/profile/ProfileContent';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 py-8">
        <ProfileContent/>
      </div>
      <Footer />
    </div>
  )
}

export default Profile;
