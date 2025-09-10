import { supabase } from "../supabaseClient";

async function handleUpload(file: File, registrationId: string) {
  try {
    if (!file) throw new Error("No file selected");

    // Unique path for each upload
    const filePath = `screenshots/${registrationId}-${Date.now()}.png`;

    // Upload to the "payments" bucket
    const { error: uploadError } = await supabase.storage
      .from("payments") // ✅ bucket name must be exactly "payments"
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("payments")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    // Save URL into registrations.payment_screenshot column
    const { error: updateError } = await supabase
      .from("registrations")
      .update({ payment_screenshot: publicUrl })
      .eq("id", registrationId);

    if (updateError) throw updateError;

    console.log("✅ Upload success, URL saved:", publicUrl);
    return publicUrl;
  } catch (err) {
    console.error("Upload process error:", err);
    throw err;
  }
}
