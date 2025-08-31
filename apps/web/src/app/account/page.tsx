'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  LogOut,
  CheckCircle,
  XCircle,
  Edit,
  Key,
  Link,
  Trash2,
  Plus
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date | string;
  updatedAt?: Date;
}

interface Account {
  id: string;
  provider: string;
  providerId?: string;
  accountId: string;
  scopes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const router = useRouter();

  // Form states
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        
        if (!session?.data?.user) {
          router.push('/sign-in');
          return;
        }

        setUser(session.data.user);
        setEditName(session.data.user.name);
        setEditEmail(session.data.user.email);

        // Load user accounts
        try {
          const userAccounts = await authClient.listAccounts();
          const accountsData = userAccounts.data || [];
          // Map the accounts to match our interface
          const mappedAccounts = accountsData.map(account => ({
            ...account,
            providerId: account.provider, // Map provider to providerId for compatibility
          }));
          setAccounts(mappedAccounts);
        } catch (error) {
          console.error('Failed to load accounts:', error);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/sign-in');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setUpdateLoading(true);
    try {
      await authClient.updateUser({
        name: editName,
        image: user.image,
      });
      
      setUser({ ...user, name: editName });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!user || editEmail === user.email) return;
    
    setUpdateLoading(true);
    try {
      await authClient.changeEmail({
        newEmail: editEmail,
        callbackURL: '/account',
      });
      
      alert('Verification email sent to your new email address. Please check your inbox.');
    } catch (error) {
      console.error('Failed to change email:', error);
      alert('Failed to change email. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }
    
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }

    setUpdateLoading(true);
    try {
      await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('Failed to change password. Please check your current password.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLinkSocialAccount = async (provider: string) => {
    try {
      await authClient.linkSocial({
        provider,
        callbackURL: '/account',
      });
    } catch (error) {
      console.error('Failed to link account:', error);
      alert('Failed to link account. Please try again.');
    }
  };

  const handleUnlinkAccount = async (providerId: string, accountId: string) => {
    try {
      await authClient.unlinkAccount({
        providerId,
        accountId,
      });
      
      setAccounts(accounts.filter(acc => acc.id !== accountId));
      alert('Account unlinked successfully!');
    } catch (error) {
      console.error('Failed to unlink account:', error);
      alert('Failed to unlink account. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await authClient.deleteUser({
        callbackURL: '/goodbye',
      });
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Your account details and verification status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.image || ''} alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                          Update your profile information
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                          />
                          {editEmail !== user.email && (
                            <p className="text-sm text-yellow-600 mt-1">
                              Changing email will require verification
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleUpdateProfile} 
                            disabled={updateLoading}
                            className="flex-1"
                          >
                            {updateLoading ? 'Updating...' : 'Update Profile'}
                          </Button>
                          {editEmail !== user.email && (
                            <Button 
                              onClick={handleChangeEmail} 
                              disabled={updateLoading}
                              variant="outline"
                            >
                              Change Email
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Email Status</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.emailVerified ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Verified
                          </Badge>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-500" />
                          <Badge variant="destructive">
                            Not Verified
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Member Since</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>

                {!user.emailVerified && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        Email Verification Required
                      </span>
                    </div>
                    <p className="text-sm text-yellow-700 mb-3">
                      Please verify your email address to access all features.
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={async () => {
                        try {
                          await authClient.sendVerificationEmail({
                            email: user.email,
                          });
                          alert('Verification email sent! Please check your inbox.');
                        } catch (error) {
                          console.error('Failed to resend verification email:', error);
                          alert('Failed to send verification email. Please try again.');
                        }
                      }}
                    >
                      Resend Verification Email
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Linked Accounts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Linked Accounts
                </CardTitle>
                <CardDescription>
                  Manage your connected social accounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {accounts.length > 0 ? (
                  accounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium capitalize">
                            {account.provider.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium capitalize">{account.provider}</p>
                          <p className="text-sm text-gray-500">{account.accountId}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnlinkAccount(account.provider, account.id)}
                      >
                        Unlink
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No linked accounts</p>
                )}
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLinkSocialAccount('google')}
                    className="flex-1"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Link Google
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLinkSocialAccount('github')}
                    className="flex-1"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Link GitHub
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Update your account password
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      <Button 
                        onClick={handleChangePassword} 
                        disabled={updateLoading}
                        className="w-full"
                      >
                        {updateLoading ? 'Changing...' : 'Change Password'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Separator />
                
                <Button 
                  variant="destructive" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Account Type</span>
                    <Badge variant="secondary">Free</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount}>
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}