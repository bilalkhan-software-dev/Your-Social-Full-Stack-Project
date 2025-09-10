import { useState, useRef } from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import {
    Box,
    Modal,
    Button,
    Avatar,
    TextField,
    Tooltip,
    IconButton,
    Typography,
    Divider,
    Backdrop,
    CircularProgress,
    LinearProgress
} from '@mui/material';
import {
    CloseRounded as CloseIcon,
    Save as SaveIcon,
    Edit as EditIcon,
    Image as ImageIcon
} from '@mui/icons-material';
import { updateProfileAction } from '../../Redux/Auth/authAction';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: 600, md: 700 },
    maxHeight: '90vh',
    overflowY: 'auto',
    outline: 'none',
    borderRadius: 3,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
};

const EditProfileModal = ({ open, handleClose, user }) => {
    const dispatch = useDispatch();
    const [uploading, setUploading] = useState({
        image: false,
        banner: false
    });
    const [uploadProgress, setUploadProgress] = useState({
        image: 0,
        banner: 0
    });
    const profileInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    const formik = useFormik({
        initialValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            bio: user?.bio || "",
            image: user?.image || "",
            banner: user?.banner || ""
        },
        onSubmit: async (values) => {
            try {
                await dispatch(updateProfileAction(values));
                handleClose();
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        }
    });

    const handleImageUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(prev => ({ ...prev, [type]: true }));
            setUploadProgress(prev => ({ ...prev, [type]: 0 }));
            
            // Upload to Cloudinary with progress tracking
            const url = await uploadToCloudinary(file, 'image', (progress) => {
                setUploadProgress(prev => ({ ...prev, [type]: progress }));
            });
            
            formik.setFieldValue(type, url);
        } catch (error) {
            console.error(`Error uploading ${type}:`, error);
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    const triggerFileInput = (type) => {
        if (type === 'image') {
            profileInputRef.current.click();
        } else {
            bannerInputRef.current.click();
        }
    };

    const removeImage = (type) => {
        formik.setFieldValue(type, "");
        if (type === 'image' && profileInputRef.current) {
            profileInputRef.current.value = "";
        } else if (bannerInputRef.current) {
            bannerInputRef.current.value = "";
        }
    };

    const isUploading = uploading.image || uploading.banner;
    const hasChanges = formik.dirty || 
                      formik.values.image !== user?.image || 
                      formik.values.banner !== user?.banner;

    return (
        <Modal
            open={open}
            onClose={!isUploading ? handleClose : undefined}
            aria-labelledby="edit-profile-modal"
            aria-describedby="edit-your-profile"
        >
            <Box sx={modalStyle} className="hide-scrollbar">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton 
                            onClick={handleClose} 
                            size="small"
                            disabled={isUploading}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" component="h2">
                            Edit Profile
                        </Typography>
                    </Box>
                    <Tooltip title="Save changes" arrow>
                        <Button
                            type="submit"
                            variant="contained"
                            size="small"
                            startIcon={<SaveIcon />}
                            onClick={formik.handleSubmit}
                            disabled={!hasChanges || isUploading}
                        >
                            {isUploading ? 'Saving...' : 'Save'}
                        </Button>
                    </Tooltip>
                </Box>

                <Divider sx={{ my: 2 }} />

                <form onSubmit={formik.handleSubmit}                >
                    {/* Hidden file inputs */}
                    <input
                        type="file"
                        ref={bannerInputRef}
                        onChange={(e) => handleImageUpload(e, 'banner')}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                    <input
                        type="file"
                        ref={profileInputRef}
                        onChange={(e) => handleImageUpload(e, 'image')}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                    {/* Banner Image with Upload Progress */}
                    <Box sx={{ position: 'relative', mb: 10 }}>
                        {uploading.banner ? (
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '200px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(0,0,0,0.05)',
                                    borderRadius: '8px 8px 0 0',
                                    gap: 2
                                }}
                            >
                                <CircularProgress />
                                <Box sx={{ width: '80%' }}>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={uploadProgress.banner} 
                                    />
                                    <Typography variant="caption" textAlign="center" display="block">
                                        Uploading banner: {uploadProgress.banner}%
                                    </Typography>
                                </Box>
                            </Box>
                        ) : (
                            <>
                                <img
                                    alt="Profile Banner"
                                    src={formik.values.banner}
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover',
                                        borderRadius: '8px 8px 0 0'
                                    }}
                                />
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0,0,0,0.7)'
                                        }
                                    }}
                                    size="small"
                                    onClick={() => triggerFileInput('banner')}
                                    disabled={uploading.banner}
                                >
                                    {formik.values.banner ? <EditIcon /> : <ImageIcon />}
                                </IconButton>
                                {formik.values.banner && (
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 40,
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0,0,0,0.7)'
                                            }
                                        }}
                                        size="small"
                                        onClick={() => removeImage('banner')}
                                        disabled={uploading.banner}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                )}
                            </>
                        )}

                        {/* Profile Picture with Upload Progress */}
                        {uploading.image ? (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: -50,
                                    left: 20,
                                    width: 100,
                                    height: 100,
                                    borderRadius: '50%',
                                    border: '4px solid white',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(0,0,0,0.05)',
                                    gap: 1
                                }}
                            >
                                <CircularProgress size={24} />
                                <Typography variant="caption">
                                    {uploadProgress.image}%
                                </Typography>
                            </Box>
                        ) : (
                            <>
                                <Avatar
                                    src={formik.values.image}
                                    sx={{
                                        position: 'absolute',
                                        bottom: -50,
                                        left: 20,
                                        width: 100,
                                        height: 100,
                                        border: '4px solid white'
                                    }}
                                />
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        bottom: -35,
                                        left: 95,
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0,0,0,0.7)'
                                        }
                                    }}
                                    size="small"
                                    onClick={() => triggerFileInput('image')}
                                    disabled={uploading.image}
                                >
                                    {formik.values.image ? <EditIcon /> : <ImageIcon />}
                                </IconButton>
                                {formik.values.image && (
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            bottom: -35,
                                            left: 130,
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0,0,0,0.7)'
                                            }
                                        }}
                                        size="small"
                                        onClick={() => removeImage('image')}
                                        disabled={uploading.image}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                )}
                            </>
                        )}
                    </Box>

                    {/* Form Fields */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <TextField
                            fullWidth
                            id="firstName"
                            name="firstName"
                            label="First Name"
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            variant="outlined"
                            disabled={isUploading}
                            required
                        />
                        <TextField
                            fullWidth
                            id="lastName"
                            name="lastName"
                            label="Last Name"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            variant="outlined"
                            disabled={isUploading}
                            required
                        />
                    </Box>

                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        id="bio"
                        name="bio"
                        label="Bio"
                        value={formik.values.bio}
                        onChange={formik.handleChange}
                        variant="outlined"
                        sx={{ mb: 3 }}
                        placeholder="Tell us about yourself..."
                        disabled={isUploading}
                        required
                    />
                </form>

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isUploading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Box>
        </Modal>
    );
};

export default EditProfileModal;