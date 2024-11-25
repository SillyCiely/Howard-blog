import PageTemplate from "../components/page-template";
import ContentContainer from "../components/content-container";
import howardImage from '../media/howard-20230114.jpg';

const EndoscopyPage = () => {
    const endoscopyTitle = `Endoscopy`
    const endoscopyDesc = `Endoscopy involves using a camera (endoscope) to look inside the gastrointestinal tract...`

    return (
        <PageTemplate title={endoscopyTitle}>
            <ContentContainer className={`flex-col-container box-container`}>
                <div id={endoscopyTitle}>
                    <h2>{endoscopyTitle}</h2>
                    <p>{endoscopyDesc}</p>
                </div>
            </ContentContainer>
        </PageTemplate>
    )
}

export default EndoscopyPage