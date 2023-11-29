import React from 'react';
import { Avatar, Button, Card, Divider } from '@mui/material';

const Profile = () => {
    return (
        <div style={{ width: '100vw', height: '100vh', marginTop: '25vh', textAlign: 'center'}}>
            <Card sx={{ background: '#F0F0F0', width: '50vw', marginLeft: '25vw', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '15px' }} >
                <div style={{textAlign: 'center'}}>
                    <Avatar sx={{ width: '100%', height: '100%', marginTop: '15px' }}/>
                    <h1>Username</h1>
                    <h2>Name</h2>
                    <h2>Surname</h2>
                    <h3>Description</h3>
                    <Button>Logout</Button>
                </div>
            </Card>
        </div>
    );
};

export default Profile;
