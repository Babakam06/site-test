import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function updateUser() {
  const email = "abdel.boussed@mairie.bc";
  const password = "AbdelBOUSSED";

  console.log(`Updating user ${email}...`);

  // Get user ID by email
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Error listing users:", listError.message);
    return;
  }

  const user = users.users.find(u => u.email === email);
  if (!user) {
    console.log("User not found, creating...");
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    if (error) {
      console.error("Error creating user:", error.message);
      return;
    }
    console.log("User created:", data.user.id);
    await updateProfile(data.user.id, email);
  } else {
    console.log("User found, updating password...");
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password: password,
      email_confirm: true
    });
    if (updateError) {
      console.error("Error updating user:", updateError.message);
      return;
    }
    console.log("User updated successfully.");
    await updateProfile(user.id, email);
  }
}

async function updateProfile(userId: string, email: string) {
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      email: email,
      role: "SUPER_ADMIN",
      status: "active",
      full_name: "Abdel Boussed"
    });

  if (profileError) {
    console.error("Error updating profile:", profileError.message);
  } else {
    console.log("Profile updated successfully.");
  }
}

updateUser();
