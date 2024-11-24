import axios from 'axios'
import React, { useState, useEffect } from 'react'
import PageTemplate from "../components/page-template";
import ContentContainer from "../components/content-container";

const ShortListPage = () => {
    // const api = import.meta.env.VITE_SERVER_URL
    // fixme: set to reference to .env file
    const api = "http://localhost:3000"
    const [short, setShort] = useState([])

    // useEffect(() => {
    //     // todo: set up shorts endpoint in the backend
    //     const url = api + '/shorts/'
    //     console.log('Request URL:', url);
    //     axios
    //         .get(url)
    //         .then((res) => {
    //             setBlogpost(res.data)
    //         })
    //         .catch((error) => console.log(error))
    // }, [])

    return (
        <PageTemplate title={`Recent Shorts`}>
            <ContentContainer>
                    <div className='box-container flex-col-container'>
                    {/*    todo: map shorts */}
                    </div>
            </ContentContainer>
        </PageTemplate>
    )
}

export default ShortListPage