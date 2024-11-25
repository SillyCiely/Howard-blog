import PageTemplate from "../components/page-template";
import ContentContainer from "../components/content-container";

export const laparoscopyTitle = `Laparoscopy`
export const laparoscopyDesc = `Laparoscopy (key-hole surgery) is a type of minimally invasive surgery that involves an operation being performed through small skin incisions. This is done by using cameras and instruments that are inserted through the tiny cuts made on the skin. Carbon dioxide is then used to create a space in which the operation can take place. The benefits of laparoscopy include less scarring, less pain, and shorter stays in hospital.`

const LaparoscopyPage = () => {
    return (
        <PageTemplate title={laparoscopyTitle}>
            <ContentContainer className={`flex-col-container box-container`}>
                <div id={laparoscopyTitle}>
                    {/*<h2>{laparoscopyTitle}</h2>*/}
                    <p>{laparoscopyDesc}</p>

                    {/*    additional text below */}
                    <h2>Preoperative Preparations</h2>
                    <p>You will need a discussion about your procedure with your surgeon and anaesthetist prior to the
                        operation. Depending on your personal circumstances you may require a review by allied health
                        staff including dietician, physiotherapist, occupational therapist, or a clinical nurse
                        specialist.
                        <br/><br/>
                        Your medications may need to be stopped prior to your operation. This includes anticoagulants
                        (blood-thinners), antiplatelets (blood-thinners), antiglycaemics (diabetes medications),
                        antihypertensives (blood pressure medications), and other health supplements (which may act as
                        blood-thinners).
                        <br/><br/>
                        You will need to start the fasting process 6 hours prior to your operation. This includes clear
                        fluids only (water, black tea with no milk, black coffee with no milk, apple juice, or clear
                        lemonade) 6 hours prior; and nil by mouth from 2 hours prior to your operation.
                    </p>

                    <h2>Post Operative Instructions </h2>
                    <ul>
                        <li>Keep the operative dressings on for 1 week. <br/>
                            This keeps your wounds clean whilst your skin is healing.
                        </li>
                        <li>Do not soak the wounds for 2 weeks. <br/>
                            This allows time for your skin to become fully waterproof.
                        </li>
                        <li>Review with you doctor in 2-4 weeks.<br/>
                            This is to check your wounds and review any pathology results.
                        </li>
                        <li>Do not perform heavy lifting (>5kg) or strenuous activities for 6 weeks.<br/>
                            This is to reduce your risk of getting a hernia through the laparoscopic incisions.
                        </li>
                        <li>Take regular over the counter pain medications (paracetamol, ibuprofen) as required.<br/>
                            The continued use of stronger pain medications may lead to addiction.
                        </li>
                        <li>Do not drive for 24 hours after your procedure, due to the effects of the anaesthetic.<br/>
                            Beyond that there are no driving restrictions, however we recommend you not to drive if you
                            are in pain or require strong pain medications.
                        </li>
                    </ul>
                </div>
            </ContentContainer>
        </PageTemplate>
    )
}

export default LaparoscopyPage