import { Grow, Conta, Paper, Grid, Typography, AppBar, Tabs, Tab, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Alert from "../../Utils/Alert";
import { Box, Container, textAlign } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import ProfileSideBar from "./ProfileSideBar";
import { useEffect, useState } from "react";
import { asyncgetBookedSlots, clearFreeParkingLots } from "../../state";
import CustomCircularProgress from "../../Utils/CustomCircularProgress";
import BookedSlotCard from "./BookedSlotCard";
import dayjs from 'dayjs'
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const theme = useTheme()
    const styles = {
        mainCont: {
            marginTop: "5em",
            width: "auto"
        },
        paper: {
            padding: "1em",
            height: "auto"
        },
        parent: {
            height: "100%",
        },
        title: {
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            alignItems: "center",
            height: "auto",
            backgroundColor: theme.palette.primary.dark,
            padding: "0.5em 0 0.5em 0",
            color: "white",
            fontWeight: 600,
            textTransform: "uppercase"
        },
        boxPadding: {
            "@media (max-width : 500px)": {
                padding: "0.2em",
            }
        },
        slotsCont:{
            marginTop:"1em"
        }
    }

    const TabPanel = (props) => {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box p={3} sx={styles.boxPadding} >
                        <div>{children}</div>
                    </Box>
                )}
            </div>
        );
    }

    const user = useSelector(state => state.auth.user)
    const navigate = useNavigate()
    const bookedTimeSlots = useSelector(state => state.auth.bookedTimeSlots)
    const inProgress1 = useSelector(state => state.auth.inProgress1)
    const dispatch = useDispatch()
    const [position, setPosition] = useState([19.2, 73.2])
    const [tabValue, setTabValue] = useState(0)
    const [tabValueInner, setTabValueInner] = useState(0)
    const [foundCurrLoc, setFoundCurrLoc] = useState(false)
    const [mobileView, setMobileView] = useState(false)


    useEffect(() => {
        if (!user._id) {
            navigate("/login")
        } else {
            if (user.role === "admin") {
                navigate("/admindb")
            }
        }
    }, [user])

    useEffect(() => {
        const setResponsiveness = () => {
            return window.innerWidth < 600 && window.innerWidth > 100
                ? setMobileView(true)
                : setMobileView(false);
        };
        setResponsiveness();

        window.addEventListener("resize", setResponsiveness);
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.log(position.coords.accuracy)
                setPosition([position.coords.latitude, position.coords.longitude])
            }, () => {
                console.log("Not able to locate")
            });
        }
        dispatch(asyncgetBookedSlots())
        dispatch(clearFreeParkingLots())
    }, [])

    const handleChangeTabs = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleChangeTabValueInner = (e, newValue) => {
        setTabValueInner(newValue)
    }

    const handleChangeIndex = (index) => {
        setTabValue(index);
    };
    const handleChangeSelect = (e) => {
        setTabValue(e.target.value)
    }

    const a11yProps = (index) => {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }


    return (
        <Grow in>
            <Container sx={styles.mainCont}>
                <Alert />
                <Paper sx={styles.paper}>
                    <Grid sx={styles.parent} container spacing={2}>
                        <Grid item xs={12}>
                            <Paper sx={styles.title}>
                                <Typography variant="h6">
                                    Hello, {user.userName}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item sm={3} xs={12} sx={styles.mainProfile}>
                            <ProfileSideBar />
                        </Grid>

                        <Grid item sm={9} xs={12} sx={styles.mainProfile}>
                            {
                                mobileView ? (
                                    <>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Booking Type</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={tabValue}
                                                label="Booking Type"
                                                onChange={handleChangeSelect}
                                            >
                                                <MenuItem value={0}>Active Booking</MenuItem>
                                                <MenuItem value={1}>Past Bookings</MenuItem>
                                                <MenuItem value={2}>Cancelled Bookings</MenuItem>
                                            </Select>
                                        </FormControl>
                                        {
                                            tabValue == 0 ? (
                                                <>
                                                    {
                                                        bookedTimeSlots.filter(slot => new Date(slot.endTime).valueOf() >= Date.now() && !slot.cancelled).length == 0 && !inProgress1 ? (
                                                            <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                                                <Grid item>
                                                                    <Typography variant="h4" fontWeight="bold">
                                                                        No Active Bookings
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        ) : (
                                                            inProgress1 ? (
                                                                <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                                                    <Grid item>
                                                                        <CustomCircularProgress inProgress={inProgress1} />
                                                                    </Grid>
                                                                </Grid>
                                                            ) : (
                                                                <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                                                    {
                                                                        bookedTimeSlots.filter(slot => new Date(slot.endTime).valueOf() >= Date.now() && !slot.cancelled).map(slot => (
                                                                            <Grid item xs={12} sm={6} md={4}>
                                                                                <BookedSlotCard refunded={null} startTime={dayjs(slot.startTime)} active={true} type={slot.parkingLot.type} vehicleType={slot.vehicleType} endTime={dayjs(slot.endTime)} name={slot.parkingLot.name} charges={slot.charges} lat={slot.parkingLot.location[0]} lng={slot.parkingLot.location[1]} address={slot.parkingLot.address} currLoc={position} vehicleNo={slot.vehicleNo} cancellable={slot.cancellable} id={slot._id} />
                                                                            </Grid>

                                                                        ))
                                                                    }
                                                                </Grid>
                                                            )
                                                        )
                                                    }
                                                </>
                                            ) : (
                                                <>
                                                    {
                                                        tabValue == 1 ? (
                                                            <>
                                                                {
                                                                    bookedTimeSlots.filter(slot => new Date(slot.endTime).valueOf() < Date.now() && !slot.cancelled).length == 0 && !inProgress1 ? (
                                                                        <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                                                            <Grid item>
                                                                                <Typography variant="h4" fontWeight="bold">
                                                                                    No Past Bookings
                                                                                </Typography>
                                                                            </Grid>
                                                                        </Grid>
                                                                    ) : (
                                                                        inProgress1 ? (
                                                                            <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                                                                <Grid item>
                                                                                    <CustomCircularProgress inProgress={inProgress1} />
                                                                                </Grid>
                                                                            </Grid>
                                                                        ) : (
                                                                            <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                                                                {
                                                                                    bookedTimeSlots.filter(slot => new Date(slot.endTime).valueOf() < Date.now() && !slot.cancelled).map(slot => (
                                                                                        <Grid item xs={12} md={6} lg={4}>
                                                                                            <BookedSlotCard refunded={null} startTime={dayjs(slot.startTime)} active={false} type={slot.parkingLot.type} vehicleType={slot.vehicleType} endTime={dayjs(slot.endTime)} name={slot.parkingLot.name} charges={slot.charges} lat={slot.parkingLot.location[0]} lng={slot.parkingLot.location[1]} currLoc={position} address={slot.parkingLot.address} vehicleNo={slot.vehicleNo} id={slot._id} />
                                                                                        </Grid>
                                                                                    ))
                                                                                }
                                                                            </Grid>
                                                                        )
                                                                    )
                                                                }</>

                                                        ) : (
                                                            <>
                                                                {
                                                                    bookedTimeSlots.filter(slot => slot.cancelled).length == 0 && !inProgress1 ? (
                                                                        <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                                                            <Grid item>
                                                                                <Typography variant="h4" fontWeight="bold">
                                                                                    No Cancelled Bookings
                                                                                </Typography>
                                                                            </Grid>
                                                                        </Grid>
                                                                    ) : (
                                                                        inProgress1 ? (
                                                                            <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                                                                <Grid item>
                                                                                    <CustomCircularProgress inProgress={inProgress1} />
                                                                                </Grid>
                                                                            </Grid>
                                                                        ) : (
                                                                            <>
                                                                                <AppBar position="static" color="default">
                                                                                    <Tabs value={tabValueInner} onChange={handleChangeTabValueInner} indicatorColor="primary" textColor="primary"
                                                                                        variant="fullWidth" aria-label="full width tabs">
                                                                                        <Tab style={{ overflow: "visible" }} label="Admin Cancelled" {...a11yProps} />
                                                                                        <Tab style={{ overflow: "visible" }} label="Self Cancelled" {...a11yProps} />
                                                                                    </Tabs>
                                                                                </AppBar>
                                                                                <TabPanel value={tabValueInner} index={0} dir={theme.direction} >
                                                                                    <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                                                                        {
                                                                                            bookedTimeSlots.filter(slot => slot.cancelled && slot.adminCancelled).length == 0 ? (
                                                                                                <Grid item>
    
                                                                                                    <Typography variant="h4" fontWeight="bold">No Admin Cancelled Bookings </Typography>
                                                                                                </Grid>
                                                                                            ) : (
                                                                                            bookedTimeSlots.filter(slot => slot.cancelled && slot.adminCancelled).map(slot => (
                                                                                                <Grid item xs={12} md={6} lg={4}>
                                                                                                    <BookedSlotCard refunded={slot.refunded} active={false} startTime={dayjs(slot.startTime)} type={slot.parkingLot.type} vehicleType={slot.vehicleType} endTime={dayjs(slot.endTime)} name={slot.parkingLot.name} charges={slot.charges} lat={slot.parkingLot.location[0]} lng={slot.parkingLot.location[1]} currLoc={position} address={slot.parkingLot.address} vehicleNo={slot.vehicleNo} id={slot._id} />
                                                                                                </Grid>
                                                                                            )))
                                                                                        }
                                                                                    </Grid>
                                                                                </TabPanel>
                                                                                <TabPanel value={tabValueInner} index={1} dir={theme.direction} >
                                                                                    <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                                                                        {
                                                                                            bookedTimeSlots.filter(slot => slot.cancelled && !slot.adminCancelled).length == 0 ? (
                                                                                                <Grid item>
    
                                                                                                    <Typography variant="h4" fontWeight="bold">No Self Cancelled Bookings </Typography>
                                                                                                </Grid>
                                                                                            ) : (
                                                                                            bookedTimeSlots.filter(slot => slot.cancelled && !slot.adminCancelled).map(slot => (
                                                                                                <Grid item xs={12} md={6} lg={4}>
                                                                                                    <BookedSlotCard refunded={slot.refunded}  active={false} startTime={dayjs(slot.startTime)} type={slot.parkingLot.type} vehicleType={slot.vehicleType} endTime={dayjs(slot.endTime)} name={slot.parkingLot.name} charges={slot.charges} lat={slot.parkingLot.location[0]} lng={slot.parkingLot.location[1]} currLoc={position} address={slot.parkingLot.address} vehicleNo={slot.vehicleNo} id={slot._id} />
                                                                                                </Grid>
                                                                                            ))
                                                                                            )
                                                                                        }
                                                                                    </Grid>
                                                                                </TabPanel>
                                                                            </>
                                                                        )
                                                                    )
                                                                }
                                                            </>
                                                        )
                                                    }
                                                </>
                                            )
                                        }
                                    </>
                                ) : (
                                    <>
                                        <AppBar position="static" color="default">
                                            <Tabs value={tabValue} onChange={handleChangeTabs} indicatorColor="primary" textColor="primary"
                                                variant="fullWidth" aria-label="full width tabs">
                                                <Tab style={{ overflow: "visible" }} label="Active Bookings" {...a11yProps} />
                                                <Tab style={{ overflow: "visible" }} label="Past Bookings" {...a11yProps} />
                                                <Tab style={{ overflow: "visible" }} label="Cancelled Bookings" {...a11yProps} />
                                            </Tabs>
                                        </AppBar>
                                        <TabPanel value={tabValue} index={0} dir={theme.direction}>
                                            {
                                                bookedTimeSlots.filter(slot => new Date(slot.endTime).valueOf() >= Date.now() && !slot.cancelled).length == 0 && !inProgress1 ? (
                                                    <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                                        <Grid item>
                                                            <Typography variant="h4" fontWeight="bold">
                                                                No Active Bookings
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                ) : (
                                                    inProgress1 ? (
                                                        <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                                            <Grid item>
                                                                <CustomCircularProgress inProgress={inProgress1} />
                                                            </Grid>
                                                        </Grid>
                                                    ) : (
                                                        <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center"> 
                                                            {
                                                                bookedTimeSlots.filter(slot => new Date(slot.endTime).valueOf() >= Date.now() && !slot.cancelled).map(slot => (
                                                                    <Grid item xs={12} md={6} lg={4}>
                                                                        <BookedSlotCard refunded={null} active={true} startTime={dayjs(slot.startTime)} type={slot.parkingLot.type} vehicleType={slot.vehicleType} endTime={dayjs(slot.endTime)} name={slot.parkingLot.name} charges={slot.charges} lat={slot.parkingLot.location[0]} lng={slot.parkingLot.location[1]} address={slot.parkingLot.address} currLoc={position} vehicleNo={slot.vehicleNo} cancellable={slot.cancellable} id={slot._id} />
                                                                    </Grid>

                                                                ))
                                                            }
                                                        </Grid>
                                                    )
                                                )
                                            }



                                        </TabPanel>
                                        <TabPanel value={tabValue} index={1} dir={theme.direction} >
                                            {
                                                bookedTimeSlots.filter(slot => new Date(slot.endTime).valueOf() < Date.now() && !slot.cancelled).length == 0 && !inProgress1 ? (
                                                    <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                                        <Grid item>
                                                            <Typography variant="h4" fontWeight="bold">
                                                                No Past Bookings
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                ) : (
                                                    inProgress1 ? (
                                                        <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                                            <Grid item>
                                                                <CustomCircularProgress inProgress={inProgress1} />
                                                            </Grid>
                                                        </Grid>
                                                    ) : (
                                                        <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                                            {
                                                                bookedTimeSlots.filter(slot => new Date(slot.endTime).valueOf() < Date.now() && !slot.cancelled).map(slot => (
                                                                    <Grid item  xs={12} md={6} lg={4}>
                                                                        <BookedSlotCard active={false} refunded={null}  startTime={dayjs(slot.startTime)} type={slot.parkingLot.type} vehicleType={slot.vehicleType} endTime={dayjs(slot.endTime)} name={slot.parkingLot.name} charges={slot.charges} lat={slot.parkingLot.location[0]} lng={slot.parkingLot.location[1]} currLoc={position} address={slot.parkingLot.address} vehicleNo={slot.vehicleNo} id={slot._id} />
                                                                    </Grid>
                                                                ))
                                                            }
                                                        </Grid>
                                                    )
                                                )
                                            }

                                        </TabPanel>
                                        <TabPanel value={tabValue} index={2} dir={theme.direction} >
                                            {
                                                bookedTimeSlots.filter(slot => slot.cancelled).length == 0 && !inProgress1 ? (
                                                    <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                                        <Grid item>
                                                            <Typography variant="h4" fontWeight="bold">
                                                                No Cancelled Bookings
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                ) : (
                                                    inProgress1 ? (
                                                        <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                                            <Grid item>
                                                                <CustomCircularProgress inProgress={inProgress1} />
                                                            </Grid>
                                                        </Grid>
                                                    ) : (
                                                        <>
                                                            <AppBar position="static" color="default">
                                                                <Tabs value={tabValueInner} onChange={handleChangeTabValueInner} indicatorColor="primary" textColor="primary"
                                                                    variant="fullWidth" aria-label="full width tabs">
                                                                    <Tab style={{ overflow: "visible" }} label="Admin Cancelled" {...a11yProps} />
                                                                    <Tab style={{ overflow: "visible" }} label="Self Cancelled" {...a11yProps} />
                                                                </Tabs>
                                                            </AppBar>
                                                            <TabPanel value={tabValueInner} index={0} dir={theme.direction} >
                                                                <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                                                    {
                                                                        bookedTimeSlots.filter(slot => slot.cancelled && slot.adminCancelled).length == 0 ? (
                                                                            <Grid item>

                                                                                <Typography variant="h4" fontWeight="bold">No Admin Cancelled Bookings </Typography>
                                                                            </Grid>
                                                                        ) : (
                                                                        bookedTimeSlots.filter(slot => slot.cancelled && slot.adminCancelled).map(slot => (
                                                                            <Grid item xs={12} md={6} lg={4}>
                                                                                <BookedSlotCard active={false} refunded={slot.refunded} startTime={dayjs(slot.startTime)} type={slot.parkingLot.type} vehicleType={slot.vehicleType} endTime={dayjs(slot.endTime)} name={slot.parkingLot.name} charges={slot.charges} lat={slot.parkingLot.location[0]} lng={slot.parkingLot.location[1]} currLoc={position} address={slot.parkingLot.address} vehicleNo={slot.vehicleNo} id={slot._id} />
                                                                            </Grid>
                                                                        ))
                                                                        )
                                                                    }
                                                                </Grid>
                                                            </TabPanel>
                                                            <TabPanel value={tabValueInner} index={1} dir={theme.direction} >
                                                                <Grid container sx={styles.slotsCont} spacing={3} justifyContent="center">
                                                                    {
                                                                        bookedTimeSlots.filter(slot => slot.cancelled && !slot.adminCancelled).length == 0 ? (
                                                                            <Grid item>

                                                                                <Typography variant="h4" fontWeight="bold">No Self Cancelled Bookings </Typography>
                                                                            </Grid>
                                                                        ) : (
                                                                        bookedTimeSlots.filter(slot => slot.cancelled && !slot.adminCancelled).map(slot => (
                                                                            <Grid item xs={12} md={6} lg={4} >
                                                                                <BookedSlotCard active={false} refunded={slot.refunded} startTime={dayjs(slot.startTime)} type={slot.parkingLot.type} vehicleType={slot.vehicleType} endTime={dayjs(slot.endTime)} name={slot.parkingLot.name} charges={slot.charges} lat={slot.parkingLot.location[0]} lng={slot.parkingLot.location[1]} currLoc={position} address={slot.parkingLot.address} vehicleNo={slot.vehicleNo} id={slot._id} />
                                                                            </Grid>
                                                                        ))
                                                                        )
                                                                    }
                                                                </Grid>
                                                            </TabPanel>
                                                        </>
                                                    )
                                                )
                                            }

                                        </TabPanel>
                                    </>
                                )
                            }

                        </Grid>
                    </Grid>
                </Paper>
            </Container>

        </Grow>
    )
}

export default ProfilePage;