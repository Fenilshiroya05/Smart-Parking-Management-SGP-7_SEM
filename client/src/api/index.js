import axios from 'axios';

//create a request with baseURL as hosted server url
const API = axios.create({baseURL:process.env.REACT_APP_BACKEND_URL})

//This adds the authentication token to header of each request sent  to server
//which is later retrived at server end and used to check for authenticated request
API.interceptors.request.use((req)=>{
    if(localStorage.getItem('authToken')){

        req.headers.Authorization = `Bearer ${
            JSON.parse(localStorage.getItem('authToken'))
        }`
    }
    return req;
})


//It obatins the location as latitude and longitude from passed parameters as city,state,country and postalCode
export const getLocByAddress = async(formData)=>{
    let url = `https://nominatim.openstreetmap.org/search?
        city=${formData.city}
        &state=${formData.state}
        &country=${formData.country}
        &postalcode=${formData.postalCode}&format=json`;
    const {data} = await axios.get(url,{headers:{'Access-Control-Allow-Origin':'https://o2cj2q.csb.app',mode:'cors'}})
    console.log(data)
    //if no location
    if(data.length==0){
        return {msg:"No Location Found for the address entered"}
    }
    return {lat:data[0].lat,lng:data[0].lon}
}

/*All requests related to user which will be processed by user controller at server side*/
const urlUser = '/api/v1/users'

export const sendOTP = (formData)=>API.post(`${urlUser}/sendOTP`,formData)

export const resendOTP = (formData)=>API.post(`${urlUser}/resendOTP`,formData)

export const verifyEmail = (formData)=>API.post(`${urlUser}/verifyEmail`,formData)

export const signIn = (formData)=>API.post(`${urlUser}/signIn`,formData)

export const getCurrentUser = ()=>API.get(`${urlUser}`)

export const postFeedback = (formData)=>API.post(`${urlUser}/feedback`,formData)

export const setProfilePic = (formData)=>API.post(`${urlUser}/profilePic`,formData)

export const sendSubscription = (subscription)=>API.post(`${urlUser}/notifications/subscribe`,subscription)

export const sendResetEmail = (formData)=>API.post(`${urlUser}/resetEmail`,formData)

export const resetPassword = (formData)=>API.post(`${urlUser}/resetPassword`,formData)

/*All requests related to parkingLot which will be processed by parkingLot controller at server side*/
const urlParkingLot = '/api/v1/parkingLots'

export const postParkingLot = (formData)=>API.post(`${urlParkingLot}`,formData)

export const getFreeParkingLots = (formData)=>API.get(`${urlParkingLot}`,{
    params:formData
})

export const bookSlot = (formData)=>API.post(`${urlParkingLot}/book`,formData)

export const getBookedSlots = ()=>API.get(`${urlParkingLot}/bookedSlots`)

export const cancelBookedSlot = (formData)=>API.delete(`${urlParkingLot}/cancelSlot`,{data:formData})


/*All requests related to admin which will be processed by admin controller at server side*/
const urlAdmin = '/api/v1/admin'

export const getUsersName = ()=>API.get(`${urlAdmin}/users`)

export const getUserHistory = (formData)=>API.get(`${urlAdmin}/userHistory`,{params:formData})

export const getParkingLotsNear = (formData)=>API.get(`${urlAdmin}/parkingLotsNear`,{params:formData})

export const getParkingLots = ()=>API.get(`${urlAdmin}/parkingLots`)

export const getParkingLotHistory = (formData)=>API.get(`${urlAdmin}/parkingLotHistory`,{params:formData})

export const deleteParkingLot = (formData)=>API.delete(`${urlAdmin}/removeParkingLot`,{data:formData})

export const makeActiveParkingLot = (id)=>API.post(`${urlAdmin}/activeLot`,{id:id})

export const getCancelledSlots = ()=>API.get(`${urlAdmin}/cancelledSlots`)

/*All requests related to payments which will be processed by payment controller at server side*/
const urlPayments = '/api/v1/payments'

export const checkoutBookSlot = (formData)=>API.post(`${urlPayments}/checkoutBookSlot`,formData)

export const getRazorPayKey = ()=>API.get(`${urlPayments}/razorPayKey`)

export const checkoutRefund = (formData)=>API.post(`${urlPayments}/checkoutRefund`,formData)

/*All requests related to news which will be processed by news controller at server side*/
const urlNews = '/api/v1/news'
export const getNews = ()=>API.get(`${urlNews}/`)