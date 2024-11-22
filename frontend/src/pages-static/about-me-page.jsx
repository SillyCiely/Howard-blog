import PageTemplate from "../components/page-template";
import ContentContainer from "../components/content-container";
import howardImage from '../media/howard-20230114.jpg';
import '../styles/image-styling.css';

const AboutMePage = () => {
    return (
        <PageTemplate title={`About Me`}>
            <ContentContainer className={`flex-row-container box-container`}>
                <img src={howardImage} alt={`Dr Howard Fan`} id={`howardImage`}/>
                <div id={`about-me-text`}>
                    <h2>Dr Howard Fan</h2>
                    <h3>BMed, MD, MHM, FRACS</h3>
                    <p>Dr Howard Fan graduated from the University of New South Wales (UNSW) with a Bachelor of Medical
                        Studies, Doctor of Medicine, and Masters of Health Management. He subsequently worked with
                        New South Wales Health before completing fellowship in general surgery to become a Fellow of the
                        Royal Australasian College of Surgery (FRACS).
                        <br/><br/>
                        Dr Fan's special interests are in gastrointestinal (GI)
                        surgery focusing on minimally invasive, laparoscopic, and endoscopic techniques. </p>
                </div>
            </ContentContainer>
        </PageTemplate>
    )
}

export default AboutMePage