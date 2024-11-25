import PageTemplate from "../components/page-template";
import ContentContainer from "../components/content-container";

export const endoscopyTitle = `Endoscopy`
export const endoscopyDesc = `Endoscopy involves using a camera (endoscope) to look inside the gastrointestinal tract. It can involve either looking at the oesophagus and stomach (oesophago-gastroscopy), or the colon (colonoscopy). These are minimally invasive procedures in which no skin incisions are made. Endoscopy can be used for both the diagnosis and treatment of bowel symptoms.`

const EndoscopyPage = () => {
    return (
        <PageTemplate title={endoscopyTitle}>
            <ContentContainer className={`flex-col-container box-container`}>
                <div id={endoscopyTitle}>
                    {/*<h2>{endoscopyTitle}</h2>*/}
                    <p>{endoscopyDesc}</p>

                    {/*    additional text below */}
                    <h2>Colonoscopy Bowel Preparation Instructions</h2>
                    <ul>
                        <li>Fluids only for 48 hours prior to your colonoscopy. This includes custards, yoghurts,
                            jellies, strained soups, and creams.
                        </li>
                        <li>Clear fluids only for 24 hours prior to your colonoscopy.</li>
                        <li>Start your bowel preparation solutions the night before your colonoscopy. This involves 3
                            sachets of bowel preparation solution (Phosphoprep, ColonLYTELY, Glycoprep, Bisalax,
                            Durolax, Picolax, or Picoprep). You may require a 4th sachet if you have experienced
                            difficulty with adequate bowel preparation in previous colonoscopies. The expected result is
                            to have clear fluid passing into the toilet by the time of your colonoscopy.
                        </li>
                    </ul>

                    <h2>Post Operative Instructions</h2>
                    <ul>
                        <li>Sips of water after the procedure.</li>
                        <li>Continue regular diet after tolerating water.</li>
                        <li>You may need new medications depending on findings of your endoscopy.</li>
                        <li>Do not drive for 24 hours after your procedure, because you will be under the influence of
                            the anaesthetic.
                        </li>
                    </ul>

                    <h2>Endoscopy Risks</h2>
                    <ul>
                        <li><strong>Bleeding:</strong> This may occur if we take biopsies or remove polyps. The risks of bleeding is generally low, but is higher if you take medications for anticoagulation (blood thinners). </li>
                        <li><strong>Bowel Perforation</strong>  (hole in the bowel): This is very rare, but if it happens you may need an operation to fix or remove the area affected. </li>
                        <li><strong>Missed lesions:</strong> Sometimes it is not possible to see every aspect of the large bowel. This is often due to inadequate bowel preparation and having poo covering parts of the bowel. We always try to clean the bowel wall when we are looking but this is not always possible and small lesions may be missed. </li>
                    </ul>
                </div>
            </ContentContainer>
        </PageTemplate>
    )
}

export default EndoscopyPage