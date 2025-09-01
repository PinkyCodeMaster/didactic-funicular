import React, { useState, useEffect } from 'react';
import { authClient } from '../lib/auth-client';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  banned?: boolean;
  banReason?: string;
  banExpires?: string;
  createdAt: string;
}

interface UserSession {
  id: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    password: '',
    name: '',
    role: 'customer'
  });

  const [roleChangeForm, setRoleChangeForm] = useState({
    userId: '',
    role: 'customer'
  });

  const [banForm, setBanForm] = useState({
    userId: '',
    reason: '',
    expiresIn: '604800' // 7 days in seconds
  });

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await authClient.admin.listUsers({
        query: { limit: 100 }
      });
      setUsers(response.users || []);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserSessions = async (userId: string) => {
    try {
      const sessions = await authClient.admin.listUserSessions({ userId });
      setUserSessions(sessions || []);
    } catch (err) {
      setError('Failed to load user sessions');
      console.error('Error loading sessions:', err);
    }
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      await authClient.admin.createUser({
        email: newUserForm.email,
        password: newUserForm.password,
        name: newUserForm.name,
        role: newUserForm.role
      });
      
      setSuccess('User created successfully');
      setNewUserForm({ email: '', password: '', name: '', role: 'customer' });
      loadUsers();
    } catch (err) {
      setError('Failed to create user');
      console.error('Error creating user:', err);
    } finally {
      setLoading(false);
    }
  };

  const changeUserRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      await authClient.admin.setRole({
        userId: roleChangeForm.userId,
        role: roleChangeForm.role
      });
      
      setSuccess('User role updated successfully');
      loadUsers();
    } catch (err) {
      setError('Failed to update user role');
      console.error('Error updating role:', err);
    } finally {
      setLoading(false);
    }
  };

  const banUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      await authClient.admin.banUser({
        userId: banForm.userId,
        banReason: banForm.reason,
        banExpiresIn: parseInt(banForm.expiresIn)
      });
      
      setSuccess('User banned successfully');
      loadUsers();
    } catch (err) {
      setError('Failed to ban user');
      console.error('Error banning user:', err);
    } finally {
      setLoading(false);
    }
  };

  const unbanUser = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await authClient.admin.unbanUser({ userId });
      
      setSuccess('User unbanned successfully');
      loadUsers();
    } catch (err) {
      setError('Failed to unban user');
      console.error('Error unbanning user:', err);
    } finally {
      setLoading(false);
    }
  };

  const revokeSession = async (sessionToken: string) => {
    try {
      setError(null);
      
      await authClient.admin.revokeUserSession({ sessionToken });
      
      setSuccess('Session revoked successfully');
      if (selectedUser) {
        loadUserSessions(selectedUser.id);
      }
    } catch (err) {
      setError('Failed to revoke session');
      console.error('Error revoking session:', err);
    }
  };

  const impersonateUser = async (userId: string) => {
    try {
      setError(null);
      
      await authClient.admin.impersonateUser({ userId });
      
      setSuccess('Now impersonating user. Refresh to see changes.');
    } catch (err) {
      setError('Failed to impersonate user');
      console.error('Error impersonating user:', err);
    }
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'founder': return 'bg-purple-500';
      case 'manager': return 'bg-blue-500';
      case 'admin': return 'bg-green-500';
      case 'employee': return 'bg-yellow-500';
      case 'customer': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={loadUsers} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="create">Create User</TabsTrigger>
          <TabsTrigger value="roles">Manage Roles</TabsTrigger>
          <TabsTrigger value="bans">Ban Management</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Manage all users in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.name}</span>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role || 'customer'}
                        </Badge>
                        {user.banned && (
                          <Badge variant="destructive">Banned</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          loadUserSessions(user.id);
                        }}
                      >
                        View Sessions
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => impersonateUser(user.id)}
                      >
                        Impersonate
                      </Button>
                      {user.banned ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => unbanUser(user.id)}
                        >
                          Unban
                        </Button>
                      ) : (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setBanForm({ ...banForm, userId: user.id })}
                        >
                          Ban
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedUser && (
            <Card>
              <CardHeader>
                <CardTitle>Sessions for {selectedUser.name}</CardTitle>
                <CardDescription>
                  Active sessions for this user
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {userSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Session {session.id}</p>
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(session.createdAt).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Expires: {new Date(session.expiresAt).toLocaleString()}
                        </p>
                        {session.ipAddress && (
                          <p className="text-xs text-muted-foreground">IP: {session.ipAddress}</p>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => revokeSession(session.token)}
                      >
                        Revoke
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New User</CardTitle>
              <CardDescription>
                Add a new user to the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newUserForm.name}
                      onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUserForm.password}
                      onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newUserForm.role}
                      onValueChange={(value) => setNewUserForm({ ...newUserForm, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="founder">Founder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create User'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Change User Role</CardTitle>
              <CardDescription>
                Update user permissions by changing their role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={changeUserRole} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">User</Label>
                  <Select
                    value={roleChangeForm.userId}
                    onValueChange={(value) => setRoleChangeForm({ ...roleChangeForm, userId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newRole">New Role</Label>
                  <Select
                    value={roleChangeForm.role}
                    onValueChange={(value) => setRoleChangeForm({ ...roleChangeForm, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="founder">Founder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Role'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bans">
          <Card>
            <CardHeader>
              <CardTitle>Ban User</CardTitle>
              <CardDescription>
                Temporarily or permanently ban a user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={banUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="banUserId">User</Label>
                  <Select
                    value={banForm.userId}
                    onValueChange={(value) => setBanForm({ ...banForm, userId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user to ban" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.filter(user => !user.banned).map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="banReason">Ban Reason</Label>
                  <Input
                    id="banReason"
                    value={banForm.reason}
                    onChange={(e) => setBanForm({ ...banForm, reason: e.target.value })}
                    placeholder="Reason for ban"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="banDuration">Ban Duration</Label>
                  <Select
                    value={banForm.expiresIn}
                    onValueChange={(value) => setBanForm({ ...banForm, expiresIn: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3600">1 Hour</SelectItem>
                      <SelectItem value="86400">1 Day</SelectItem>
                      <SelectItem value="604800">1 Week</SelectItem>
                      <SelectItem value="2592000">1 Month</SelectItem>
                      <SelectItem value="0">Permanent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" variant="destructive" disabled={loading}>
                  {loading ? 'Banning...' : 'Ban User'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}