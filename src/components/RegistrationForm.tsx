import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Users, Building, Github, Linkedin, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function RegistrationForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    teamName: '',
    teamLeaderName: '',
    teamLeaderEmail: '',
    teamLeaderPhone: '',
    teamSize: '2',
    institution: '',
    state: '',
    githubProfile: '',
    linkedinProfile: '',
    teamMembers: ['', '', ''] // Max 3 additional members
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) => i === index ? value : member)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.teamName || !formData.teamLeaderName || !formData.teamLeaderEmail || !formData.teamLeaderPhone) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Filter out empty team members
      const activeMembers = formData.teamMembers.filter(member => member.trim() !== '');
      
      // Parse team size to integer
      const parsedTeamSize = parseInt(formData.teamSize.toString().replace(/[^\d]/g, ''), 10);

      if (parsedTeamSize < 2 || parsedTeamSize > 4) {
        toast.error('Team size must be between 2-4 members');
        return;
      }

      // Validate that we have the right number of team members
      const expectedMembers = parsedTeamSize - 1; // Excluding leader
      const providedMembers = activeMembers.length;
      
      if (providedMembers < expectedMembers) {
        toast.error(`Please provide names for all ${expectedMembers} team members`);
        return;
      }

      // Prepare team members data
      const teamMembersData = activeMembers.slice(0, expectedMembers).map((name, index) => ({
        name: name.trim(),
        position: `Member ${index + 1}`
      }));

      // Insert registration data
      const { data, error } = await supabase
        .from('registrations')
        .insert([{
          team_name: formData.teamName,
          team_leader_name: formData.teamLeaderName,
          name: formData.teamLeaderName,
          team_leader_email: formData.teamLeaderEmail,
          team_leader_phone: formData.teamLeaderPhone,
          team_size: parsedTeamSize,
          institution: formData.institution,
          state: formData.state,
          github_profile: formData.githubProfile,
          linkedin_profile: formData.linkedinProfile,
          team_members: teamMembersData,
          registration_date: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error("Supabase Insert Error:", error);
        throw new Error(`Registration failed: ${error.message}`);
      }

      if (!data) {
        throw new Error("Registration failed: No data returned");
      }

      toast.success('Registration successful! Proceeding to payment...');
      
      // Navigate to payment page with registration data
      navigate('/payment', {
        state: {
          id: data.id,
          teamName: formData.teamName,
          teamLeaderName: formData.teamLeaderName,
          teamLeaderEmail: formData.teamLeaderEmail
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 relative">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Register for Skill Sprint</h1>
            <p className="text-gray-300">Fill in your team details to participate</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Team Name *
                </label>
                <input
                  type="text"
                  name="teamName"
                  required
                  value={formData.teamName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your team name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Team Size *
                </label>
                <select
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="2">2 Members</option>
                  <option value="3">3 Members</option>
                  <option value="4">4 Members</option>
                </select>
              </div>
            </div>

            {/* Team Leader Information */}
            <div className="border-t border-white/10 pt-6">
              <h4 className="text-lg font-semibold mb-4">Team Leader Information</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="teamLeaderName"
                    required
                    value={formData.teamLeaderName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="teamLeaderEmail"
                    required
                    value={formData.teamLeaderEmail}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="teamLeaderPhone"
                    required
                    value={formData.teamLeaderPhone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Building className="w-4 h-4 inline mr-2" />
                    Institution
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="College/University name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Your state"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Github className="w-4 h-4 inline mr-2" />
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    name="githubProfile"
                    value={formData.githubProfile}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Linkedin className="w-4 h-4 inline mr-2" />
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedinProfile"
                    value={formData.linkedinProfile}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="border-t border-white/10 pt-6">
              <h4 className="text-lg font-semibold mb-4">Team Members (excluding leader)</h4>
              <div className="space-y-3">
                {formData.teamMembers.slice(0, parseInt(formData.teamSize) - 1).map((member, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Member {index + 1} Name {index === 0 ? '*' : ''}
                    </label>
                    <input
                      type="text"
                      required={index === 0}
                      value={member}
                      onChange={(e) => handleMemberChange(index, e.target.value)}
                      className="input-field"
                      placeholder={`Enter member ${index + 1} name`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Users className="w-5 h-5" />
                  Register Team
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}