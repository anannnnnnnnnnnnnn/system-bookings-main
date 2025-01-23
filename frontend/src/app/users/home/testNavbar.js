import React, { useState } from "react";
import { Select } from "@mui/material"; // เพิ่มการนำเข้า Select ที่นี่
import { AppBar, Avatar, Box, IconButton, Menu, MenuItem, Stack, Toolbar, Typography, styled, ListItemIcon, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HomeIcon from "@mui/icons-material/Home";
import FlagIcon from "@mui/icons-material/Flag";
import LanguageIcon from "@mui/icons-material/Language"; // ไอคอนสำหรับภาษาต่างๆ

const StyledSelect = styled(Select)({
    width: 300,
    color: "black",
    "& .MuiOutlinedInput-notchedOutline": { border: 0 },
    "&:focus": { border: "1px solid green" },
});

const Header = ({ drawerToggle }) => {
    const [anchorElLanguage, setAnchorElLanguage] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [language, setLanguage] = useState("th");

    const handleMenu = (event) => {
        setAnchorElLanguage(event.currentTarget);
    };

    const handleLanguageChange = (value) => {
        setLanguage(value);
        setAnchorElLanguage(null);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleSignOut = () => {
        setAnchorElUser(null);
        // Handle sign-out logic here
    };

    return (
        <AppBar
            position="fixed"
            elevation={2}
            sx={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                backgroundColor: "transparent",
                zIndex: 1201,
            }}
        >
            <Toolbar variant="dense" sx={{ backgroundColor: "background.paper" }}>
                <IconButton
                    size="large"
                    edge="start"
                    aria-label="open drawer"
                    sx={{ mr: 1, display: { xl: "none" } }}
                    onClick={drawerToggle}
                >
                    <MenuIcon />
                </IconButton>

                <Box sx={{ mr: 2 }}>
                    <HomeIcon sx={{ fontSize: 40 }} />
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" spacing={3}>
                        <Typography
                            variant="body1"
                            noWrap
                            color="text.secondary"
                            sx={{ fontWeight: "bold", display: { xs: "none", md: "block" } }}
                        >
                            Islamic Management Center System
                        </Typography>
                        <Typography
                            variant="h6"
                            noWrap
                            color="text.secondary"
                            sx={{ mt: "5px", fontWeight: "bold", display: { xs: "block", md: "none" } }}
                        >
                            i-MaCS
                        </Typography>
                    </Stack>
                </Box>

                <Stack direction="row" spacing={2} alignItems="center">
                    <IconButton size="medium" onClick={handleMenu}>
                        {/* ใช้ FlagIcon แทน Image */}
                        {language === "th" ? (
                            <FlagIcon sx={{ fontSize: 20, color: "black" }} />
                        ) : (
                            <LanguageIcon sx={{ fontSize: 20, color: "black" }} />
                        )}
                        <ArrowDropDownIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorElLanguage}
                        open={Boolean(anchorElLanguage)}
                        onClose={() => setAnchorElLanguage(null)}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                        <MenuItem onClick={() => handleLanguageChange("th")}>
                            <ListItemIcon>
                                <FlagIcon sx={{ fontSize: 20 }} />
                            </ListItemIcon>
                            <ListItemText>Thai</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handleLanguageChange("eng")}>
                            <ListItemIcon>
                                <LanguageIcon sx={{ fontSize: 20 }} />
                            </ListItemIcon>
                            <ListItemText>English</ListItemText>
                        </MenuItem>
                    </Menu>

                    <IconButton size="medium">
                        <SettingsIcon />
                    </IconButton>

                    <IconButton size="medium" onClick={handleOpenUserMenu}>
                        <Avatar alt="User Avatar" src="" />
                    </IconButton>
                    <Menu
                        anchorEl={anchorElUser}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                        <MenuItem onClick={handleCloseUserMenu}>
                            <ListItemIcon>
                                <PersonIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Profile" />
                        </MenuItem>
                        <MenuItem onClick={handleSignOut}>
                            <ListItemIcon>
                                <ExitToAppIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Sign Out" />
                        </MenuItem>
                    </Menu>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
