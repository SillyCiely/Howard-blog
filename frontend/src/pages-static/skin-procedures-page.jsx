import PageTemplate from "../components/page-template";
import ContentContainer from "../components/content-container";

export const skinProcTitle = `Skin Procedures`
export const skinProcDesc = `Skin lesions can be cancerous or non-cancerous. Skin cancers are very common in Australia and early intervention can prevent future detrimental consequences. Consult your doctor early if you have concerns about any skin changes. Early treatment and excision of skin cancers can prevent death.`

const SkinProceduresPage = () => {
    return (
        <PageTemplate title={skinProcTitle}>
            <ContentContainer className={`flex-col-container box-container`}>
                <div id={skinProcTitle}>
                    <h2>{skinProcTitle}</h2>
                    <p>{skinProcDesc}</p>
                    {/*    additional text below */}
                    <h2></h2>
                </div>  
            </ContentContainer>
        </PageTemplate>
    )
}

export default SkinProceduresPage