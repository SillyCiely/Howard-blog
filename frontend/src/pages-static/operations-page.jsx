import PageTemplate from "../components/page-template";
import ContentContainer from "../components/content-container";
import { Link } from "react-router-dom";
import { laparoscopyTitle, laparoscopyDesc } from "./laparoscopy-page";
import { endoscopyTitle, endoscopyDesc } from "./endoscopy-page";
import { skinProcTitle, skinProcDesc } from "./skin-procedures-page";

const OperationsPage = () => {
    return (
        <PageTemplate title={`Operations`}>
            <ContentContainer className={`flex-row-container gap`}>
                <div className={`flex-col-container box-container`}>
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
                </div>

                <div className={`box-container`}>
                    <h2>General Anaesthetic Risks</h2>
                    <ul>
                        <li><strong>Reactions to the anaesthetic: </strong>Reactions such as anaphylaxis to medications used for anaesthetics are very rare and you will be treated immediately by your anaesthetist. Depending on your allergic reaction, your operation may be cancelled in the interests of your overall health. </li>
                        <li><strong>Heart attack / stroke: </strong>Anaesthetics and the physiological stress of an operation increases the strain on your heart. These are rare complications, and usually related to underlying heart diseases. </li>
                        <li><strong>Breathing difficulties: </strong>General anaesthetic is designed to relax your muscles including those responsible for your breathing. These issues are rare and temporary. Risks are usually related to underlying lung and heart conditions. </li>
                        <li><strong>Being semi-conscious: </strong>This is related to individual tolerance to anaesthetics and is very rare.</li>
                        <li><strong>Aspiration: </strong>Food content may come up from your stomach and go down into your lung. This is the reason we ask you to fast before an operation.</li>
                        <li><strong>Nerve injury: </strong>A nerve may be temporarily compressed during your operation because you are not awake to reposition yourself. This is rare and temporary, however, recovery may take up to many weeks depending on the nerve involved and the duration of the operation.</li>
                        <li><strong>Minor damage to mouth/teeth: </strong>This is due to the breathing tube being placed in your mouth which may cause irritation after the procedure.</li>
                        <li><strong>Hoarse voice: </strong>The breathing tube reaches all the way down your throat and may cause a bit of irritation leading to a hoarse voice. You can expect to fully recover from this irritation.</li>
                        <li><strong>Temporary vision changes: </strong>All care is taken to protect the eyes because you will be unable to close your own eyes under a general anaesthetic. Eye ointments are often used and may cause blurriness on waking.</li>
                        <li><strong>Cognitive changes: </strong>Anaesthetics affects the brain and can cause confusion and memory loss. Older people, particularly anyone with underlying dementia are more likely affected.</li>
                    </ul>
                </div>
            </ContentContainer>
        </PageTemplate>
    )
}

export default OperationsPage