import React from 'react'
import { useParams } from 'react-router-dom'
import LegalServicesPage from './LegalServices';
import SecurityPrivacyPage from './SecurityPrivacy';

function Service() {
    const {value} = useParams()
    console.log(value);
    if(value == "legal") return (<LegalServicesPage/>) 
    else if(value == "security") return (<SecurityPrivacyPage/>) 
  
}

export default Service
