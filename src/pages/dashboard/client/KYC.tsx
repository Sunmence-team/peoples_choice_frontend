import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileCheck,
  User,
  ArrowRight,
  Loader2,
  Lock,
  FileText,
} from "lucide-react";
import {
  getKYCStatusService,
  submitKYCService,
  type KYCStatusResponse,
} from "../../../services/kycServices";
import { formatISODateToCustom } from "../../../helpers/formatterUtility";
import { getErrorMessage } from "../../../helpers/api";

const kycValidationSchema = Yup.object().shape({
  document_type: Yup.string().required("Please select document type"),
  document_number: Yup.string()
    .trim()
    .required("Official document ID number is required"),
  front_image: Yup.mixed().required(
    "Front image of your identity document is required",
  ),
  back_image: Yup.mixed().when("document_type", {
    is: (val: string) => val !== "passport",
    then: (schema) =>
      schema.required(
        "National ID, Driver's License and Residence Permit require a back image",
      ),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export default function KYC() {
  const navigate = useNavigate();
  const [kycData, setKycData] = useState<KYCStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Previews
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadStatus();
  }, []);

  async function loadStatus() {
    setLoading(true);
    try {
      const data = await getKYCStatusService();
      setKycData(data);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load verification status"));
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const isVerified = kycData?.is_verified || kycData?.kyc_status === "verified";
  const isPending = kycData?.kyc_status === "pending";
  const isRejected = kycData?.kyc_status === "rejected";

  return (
    <div className="w-full">
      {/* Page Heading */}
      <div className="mb-3 sm:mb-4">
        <h1 className="text-base sm:text-lg font-bold text-primary">
          Identity Verification (KYC)
        </h1>
        <p className="hidden md:block mt-0.5 text-xs font-medium text-gray-500">
          Complete KYC identity verification to unlock higher withdrawal
          limits and international banking facilities.
        </p>
      </div>

      {/* STATE 1: VERIFIED */}
      {isVerified && (
        <div className="rounded-xl border border-secondary bg-white p-5 sm:p-6 shadow-xs max-w-2xl mx-auto text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600 mb-3 border border-green-200">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-primary">
            Identity Verified & Approved
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto leading-relaxed">
            Your government-issued identity documents have been authenticated by
            People's Choice Bank underwriting compliance. Your account tier is
            fully unrestricted.
          </p>
          {/* 
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-100/80 px-3 py-1 text-[11px] font-semibold text-green-700">
            <ShieldCheck size={14} />
            <span>Tier 2 Full KYC Verified</span>
          </div> */}

          {kycData?.latest_submission && (
            <div className="mt-5 rounded-lg bg-gray-50 p-3 border border-secondary text-xs text-left max-w-md mx-auto space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-[11px]">Document Type</span>
                <span className="font-semibold text-primary capitalize">
                  {kycData.latest_submission.document_type.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-[11px]">Document Ref</span>
                <span className="font-mono text-primary">
                  {kycData.latest_submission.document_number}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-[11px]">Verified Date</span>
                <span className="text-gray-600">
                  {formatISODateToCustom(
                    kycData.latest_submission.created_at,
                  ) || "Active"}
                </span>
              </div>
            </div>
          )}

          <div className="mt-5">
            <button
              type="button"
              onClick={() => navigate("/dashboard/overview")}
              className="h-9 px-5 rounded-lg bg-primary text-xs font-semibold text-white transition hover:bg-primary/90 cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Go to Overview</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STATE 2: PENDING REVIEW */}
      {isPending && !isVerified && (
        <div className="rounded-xl border border-secondary bg-white p-5 sm:p-6 shadow-xs max-w-2xl mx-auto text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600 mb-3 border border-amber-200">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-primary">
            Verification Under Review
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto leading-relaxed">
            Your identity documents have been securely uploaded and are
            currently being inspected by compliance officers. Reviews typically
            conclude within 12 to 24 business hours.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-100/80 px-3 py-1 text-[11px] font-semibold text-amber-800">
            <span>Pending Underwriting Approval</span>
          </div>

          {kycData?.latest_submission && (
            <div className="mt-5 rounded-lg bg-gray-50 p-3 border border-secondary text-xs text-left max-w-md mx-auto space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-[11px]">Document Type</span>
                <span className="font-semibold text-primary capitalize">
                  {kycData.latest_submission.document_type.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-[11px]">Document Ref</span>
                <span className="font-mono text-primary">
                  {kycData.latest_submission.document_number}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-[11px]">
                  Submission Date
                </span>
                <span className="text-gray-600">
                  {formatISODateToCustom(
                    kycData.latest_submission.created_at,
                  ) || "Recently submitted"}
                </span>
              </div>
              {(kycData.latest_submission.front_image_url ||
                kycData.latest_submission.back_image_url) && (
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <span className="text-[11px] font-semibold text-primary block mb-1.5">
                    Uploaded Verification Documents
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {kycData.latest_submission.front_image_url && (
                      <a
                        href={kycData.latest_submission.front_image_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-secondary text-[11px] font-medium text-primary hover:bg-gray-100 transition"
                      >
                        <FileText size={12} />
                        <span>Front Document</span>
                      </a>
                    )}
                    {kycData.latest_submission.back_image_url && (
                      <a
                        href={kycData.latest_submission.back_image_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-secondary text-[11px] font-medium text-primary hover:bg-gray-100 transition"
                      >
                        <FileText size={12} />
                        <span>Back Document</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/dashboard/overview")}
              className="h-9 px-5 rounded-lg bg-primary text-xs font-semibold text-white transition hover:bg-primary/90 cursor-pointer"
            >
              Back to Dashboard
            </button>
            <button
              type="button"
              onClick={loadStatus}
              className="h-9 px-4 rounded-lg border border-secondary text-xs font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
            >
              Refresh Status
            </button>
          </div>
        </div>
      )}

      {/* STATE 3: UNVERIFIED OR REJECTED -> RENDER SUBMISSION FORM */}
      {!isVerified && !isPending && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4 sm:gap-5">
          {/* Form Side */}
          <div className="rounded-xl border border-secondary bg-white p-3.5 sm:p-5 shadow-xs">
            {isRejected && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-bold">Previous Submission Rejected</h4>
                  <p className="mt-0.5 text-[11px] text-red-600 leading-relaxed">
                    {kycData?.rejection_reason ||
                      "Document photo was blurry, expired, or cropped. Please review the guidelines and upload clear, unedited photographs."}
                  </p>
                </div>
              </div>
            )}

            <Formik
              initialValues={{
                document_type: "passport",
                document_number: "",
                front_image: null as File | null,
                back_image: null as File | null,
                selfie_image: null as File | null,
              }}
              validationSchema={kycValidationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const formData = new FormData();
                  formData.append("document_type", values.document_type);
                  formData.append(
                    "document_number",
                    values.document_number.trim(),
                  );
                  if (values.front_image) {
                    formData.append("front_image", values.front_image);
                  }
                  if (values.back_image) {
                    formData.append("back_image", values.back_image);
                  }
                  if (values.selfie_image) {
                    formData.append("selfie_image", values.selfie_image);
                  }

                  const res = await submitKYCService(formData);
                  toast.success(res.message);
                  await loadStatus();
                } catch (err) {
                  toast.error(
                    getErrorMessage(
                      err,
                      "Failed to submit verification documents",
                    ),
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ values, setFieldValue, isSubmitting }) => (
                <Form className="space-y-4">
                  {/* Step 1: Document Type */}
                  <div>
                    <label className="block text-[11px] font-semibold text-primary mb-1.5">
                      1. Select Government Issued Document Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "passport", label: "Passport" },
                        { id: "national_id", label: "National ID Card" },
                        { id: "drivers_license", label: "Driver's License" },
                        { id: "residence_permit", label: "Residence Permit" },
                      ].map((doc) => (
                        <button
                          key={doc.id}
                          type="button"
                          onClick={() => setFieldValue("document_type", doc.id)}
                          className={`h-9 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                            values.document_type === doc.id
                              ? "border-primary bg-primary text-white shadow-xs"
                              : "border-secondary bg-gray-50 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {doc.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Document Number */}
                  <div>
                    <label className="block text-[11px] font-semibold text-primary mb-1">
                      2. Document / Identification Number
                    </label>
                    <Field
                      type="text"
                      name="document_number"
                      placeholder="e.g. A12345678 or 982-102-482"
                      className="h-9 w-full rounded-lg border border-secondary bg-white px-3 text-xs font-mono font-semibold text-primary outline-none focus:border-primary transition"
                    />
                    <ErrorMessage
                      name="document_number"
                      component="div"
                      className="text-red-500 text-[10px] mt-1"
                    />
                  </div>

                  {/* Step 3: Photo Uploads */}
                  <div className="space-y-3">
                    <label className="block text-[11px] font-semibold text-primary">
                      3. Upload Document Images (JPG or PNG, max 10MB)
                    </label>

                    {/* Front Image (Required) */}
                    <div className="rounded-lg border border-dashed border-gray-300 p-3 hover:border-primary transition bg-gray-50/50">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-primary">
                          Front Side of Document{" "}
                          <span className="text-red-500">*</span>
                        </span>
                        {values.front_image && (
                          <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 size={12} /> Ready
                          </span>
                        )}
                      </div>

                      {frontPreview ? (
                        <div className="relative mt-2 h-32 w-full rounded-md overflow-hidden bg-black/5 border border-gray-200">
                          <img
                            src={frontPreview}
                            alt="Front Preview"
                            className="h-full w-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFieldValue("front_image", null);
                              setFrontPreview(null);
                            }}
                            className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 text-[10px] hover:bg-black"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => frontInputRef.current?.click()}
                          className="w-full py-4 flex flex-col items-center justify-center text-gray-500 hover:text-primary cursor-pointer"
                        >
                          <Upload className="h-5 w-5 mb-1 text-gray-400" />
                          <span className="text-[11px] font-semibold">
                            Click to select front photo
                          </span>
                          <span className="text-[9.5px] text-gray-400">
                            Clear photo with all 4 corners visible
                          </span>
                        </button>
                      )}
                      <input
                        ref={frontInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 10 * 1024 * 1024) {
                              toast.error("File size must not exceed 10MB");
                              return;
                            }
                            setFieldValue("front_image", file);
                            setFrontPreview(URL.createObjectURL(file));
                          }
                        }}
                        className="hidden"
                      />
                      <ErrorMessage
                        name="front_image"
                        component="div"
                        className="text-red-500 text-[10px] mt-1"
                      />
                    </div>

                    {/* Back Image (Required for ID/License, Optional for Passport) */}
                    <div className="rounded-lg border border-dashed border-gray-300 p-3 hover:border-primary transition bg-gray-50/50">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-primary">
                          Back Side of Document{" "}
                          {values.document_type === "passport" ? (
                            "(Optional)"
                          ) : (
                            <span className="text-red-500">*</span>
                          )}
                        </span>
                        {values.back_image && (
                          <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 size={12} /> Ready
                          </span>
                        )}
                      </div>

                      {backPreview ? (
                        <div className="relative mt-2 h-32 w-full rounded-md overflow-hidden bg-black/5 border border-gray-200">
                          <img
                            src={backPreview}
                            alt="Back Preview"
                            className="h-full w-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFieldValue("back_image", null);
                              setBackPreview(null);
                            }}
                            className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 text-[10px] hover:bg-black"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => backInputRef.current?.click()}
                          className="w-full py-4 flex flex-col items-center justify-center text-gray-500 hover:text-primary cursor-pointer"
                        >
                          <Upload className="h-5 w-5 mb-1 text-gray-400" />
                          <span className="text-[11px] font-semibold">
                            Click to select back photo
                          </span>
                          <span className="text-[9.5px] text-gray-400">
                            Barcode / chip must be clearly legible
                          </span>
                        </button>
                      )}
                      <input
                        ref={backInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 10 * 1024 * 1024) {
                              toast.error("File size must not exceed 10MB");
                              return;
                            }
                            setFieldValue("back_image", file);
                            setBackPreview(URL.createObjectURL(file));
                          }
                        }}
                        className="hidden"
                      />
                      <ErrorMessage
                        name="back_image"
                        component="div"
                        className="text-red-500 text-[10px] mt-1"
                      />
                    </div>

                    {/* Selfie Image (Optional) */}
                    <div className="rounded-lg border border-dashed border-gray-300 p-3 hover:border-primary transition bg-gray-50/50">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-primary">
                          Selfie with ID Photo (Optional Verification Booster)
                        </span>
                        {values.selfie_image && (
                          <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 size={12} /> Ready
                          </span>
                        )}
                      </div>

                      {selfiePreview ? (
                        <div className="relative mt-2 h-32 w-full rounded-md overflow-hidden bg-black/5 border border-gray-200">
                          <img
                            src={selfiePreview}
                            alt="Selfie Preview"
                            className="h-full w-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFieldValue("selfie_image", null);
                              setSelfiePreview(null);
                            }}
                            className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 text-[10px] hover:bg-black"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => selfieInputRef.current?.click()}
                          className="w-full py-4 flex flex-col items-center justify-center text-gray-500 hover:text-primary cursor-pointer"
                        >
                          <User className="h-5 w-5 mb-1 text-gray-400" />
                          <span className="text-[11px] font-semibold">
                            Take or upload a clear portrait selfie
                          </span>
                          <span className="text-[9.5px] text-gray-400">
                            Neutral facial expression, no sunglasses or hat
                          </span>
                        </button>
                      )}
                      <input
                        ref={selfieInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 10 * 1024 * 1024) {
                              toast.error("File size must not exceed 10MB");
                              return;
                            }
                            setFieldValue("selfie_image", file);
                            setSelfiePreview(URL.createObjectURL(file));
                          }
                        }}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 w-full rounded-lg bg-primary text-xs font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 mt-2 shadow-xs"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Uploading Documents to Compliance Vault...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        <span>Submit Identity Verification</span>
                      </>
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          {/* Right Explainer Column */}
          <div className="space-y-3.5">
            <div className="rounded-xl border border-secondary bg-[#f8fafc] p-3.5 sm:p-4">
              <div className="flex items-center gap-1.5 text-primary mb-2.5">
                <FileCheck className="h-4 w-4 text-tertiary" />
                <h3 className="text-xs sm:text-[13px] font-bold text-primary">
                  Document Requirements
                </h3>
              </div>

              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-start gap-2 text-[11px]">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>
                    <strong>Valid & Unexpired</strong>: Document must be
                    currently valid and issued by a recognized government
                    entity.
                  </span>
                </li>
                <li className="flex items-start gap-2 text-[11px]">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>
                    <strong>Full Frame & In Focus</strong>: All four corners of
                    the card or book must be fully visible without flash glare.
                  </span>
                </li>
                <li className="flex items-start gap-2 text-[11px]">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>
                    <strong>High Resolution</strong>: Text, photo, and MRZ
                    machine-readable zones must be clearly readable.
                  </span>
                </li>
                <li className="flex items-start gap-2 text-[11px]">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>
                    <strong>Unmodified Original</strong>: Screenshots,
                    photocopies, or edited photos will be automatically
                    rejected.
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-secondary bg-white p-3.5 sm:p-4">
              <div className="flex items-center gap-1.5 text-primary mb-2">
                <Lock className="h-4 w-4 text-tertiary" />
                <h3 className="text-xs sm:text-[13px] font-bold text-primary">
                  Data Privacy & Encryption
                </h3>
              </div>
              <p className="text-[10.5px] text-gray-500 leading-relaxed">
                All submitted documents are encrypted with AES-256 bank-grade
                cryptography and stored strictly for KYC regulatory compliance.
                Documents are never sold or shared with third parties.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
