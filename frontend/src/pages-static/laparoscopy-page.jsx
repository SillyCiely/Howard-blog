import PageTemplate from "../components/page-template";
import ContentContainer from "../components/content-container";
import howardImage from '../media/howard-20230114.jpg';

const LaparoscopyPage = () => {
    export const laparoscopyTitle = `Laparoscopy`
    export const laparoscopyDesc = `Laparoscopy is a minimally invasive surgical technique...`

    return (
        <PageTemplate title={laparoscopyTitle}>
            <ContentContainer className={`flex-col-container box-container`}>
                <div id={laparoscopyTitle}>
                    <h2>{laparoscopyTitle}</h2>
                    <p>{laparoscopyDesc}</p>
                </div>
            </ContentContainer>
        </PageTemplate>
    )
}

export default LaparoscopyPage