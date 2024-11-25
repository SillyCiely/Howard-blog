import PageTemplate from "../components/page-template";
import ContentContainer from "../components/content-container";
import { Link } from "react-router-dom";
import { laparoscopyTitle, laparoscopyDesc } from "./laparoscopy-page";
import { endoscopyTitle, endoscopyDesc } from "./endoscopy-page";
import { skinProcTitle, skinProcDesc } from "./skin-procedures-page";

const OperationsPage = () => {
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
                    <Link to={`/operations/skin-procedures`}>
                        <h2>{skinProcTitle}</h2>
                    </Link>
                    <p>{skinProcDesc}</p>
                </div>
            </ContentContainer>
        </PageTemplate>
    )
}

export default OperationsPage