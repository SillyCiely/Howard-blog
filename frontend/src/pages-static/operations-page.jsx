import PageTemplate from "../components/page-template";
import ContentContainer from "../components/content-container";
import howardImage from '../media/howard-20230114.jpg';
import { Link } from "react-router-dom";


const OperationsPage = () => {
    const laparoscopyTitle = `Laparoscopy`
    const laparoscopyDesc = `Laparoscopy is a minimally invasive surgical technique...`
    const endoscopyTitle = `Endoscopy`
    const endoscopyDesc = `Endoscopy involves using a camera (endoscope) to look inside the gastrointestinal tract...`
    const skinProcTitle = `Skin Procedures`
    const skinProcDesc = `Skin lesions can be cancerous or non-cancerous...`

    return (
        <PageTemplate title={`Operations`}>
            <ContentContainer className={`flex-col-container box-container`}>
                <div id={laparoscopyTitle}>
                    <Link to={`/operations/${laparoscopyTitle}`}>
                        <h2>{laparoscopyTitle}</h2>
                    </Link>
                    <p>{laparoscopyDesc}</p>
                </div>
                <div id={endoscopyTitle}>
                    <Link to={`/operations/${endoscopyTitle}`}>
                        <h2>{endoscopyTitle}</h2>
                    </Link>
                    <p>{endoscopyDesc}</p>
                </div>
                <div id={skinProcTitle}>
                    <Link to={`/operations/${skinProcTitle}`}>
                        <h2>{skinProcTitle}</h2>
                    </Link>
                    <p>{skinProcDesc}</p>
                </div>
            </ContentContainer>
        </PageTemplate>
    )
}

export default OperationsPage