import PageTemplate from "../components/page-template";
import ContentContainer from "../components/content-container";
import howardImage from '../media/howard-20230114.jpg';

const SkinProceduresPage = () => {
    const skinProcTitle = `Skin Procedures`
    const skinProcDesc = `Skin lesions can be cancerous or non-cancerous...`

    return (
        <PageTemplate title={skinProcTitle}>
            <ContentContainer className={`flex-col-container box-container`}>
                <div id={skinProcTitle}>
                    <h2>{skinProcTitle}</h2>
                    <p>{skinProcDesc}</p>
                </div>  
            </ContentContainer>
        </PageTemplate>
    )
}

export default SkinProceduresPage