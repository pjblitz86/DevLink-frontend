# DevLink - frontend

> Social network for developers

This is the frontend part of the fullstack DevLink application done with react. It is a small social network app that includes authentication, profiles, jobs and forum posts.

# Quick Start 🚀

### Install the dependencies

```bash
npm install
```

### Launch the project

```bash
npm run dev
```

make sure DevLink backend project is also running for api calls.

# Implemented features, page structure

### UI/Theme

Css responsive design, additional tailwind classes, quickly change primary, dark, light, success, danger color schemes in App.css

### Authentication

Login, register, logout, navbar logic to not show private route pages.
Public pages - developers and jobs, the rest are private - user login needed.  
Token (jwt) is saved in localStorage on the frontend and then sent with each request to access protected routes.  
 Spring security configuration + jwt is used on the backend to decode the token and authorize the user.

### Redux toolkit state

App level state is used so that every component can access it when needed. If page is refreshed anywhere the state stays and user is not logged out. Also loadUser is used to check if token is valid even if you close the tab and later come back to the page.

### Custom Alerts

Success and danger alerts. Shows validation errors. When post, edit, delete operation finishes the alert will display if it was a success or failure.

### Landing/home page

Default route, guests land here. Here they can access public routes - developers, jobs, register and login pages.
If user is logged in or just registered - will be redirected to dashboard

### Dashboard page - protected

Only for authenticated users. When user first comes here, profile can be created and is then attached to the user. User can be without profile also.  
Profile creation form must be filled and validated for required fields.  
When that is successful dashboard changes to these sections:  
○ UI buttons - view profile, edit profile, add experience, add education.  
○ Experience section - optional, user can add job experiences via form or delete them.  
○ Education - optional, can add or delete educations.  
○ Danger Zone - delete profile and account options.  
Edit profile works on the same form as create profile (code reuse).

### Developers page - profiles

All user created profiles from db are displayed here. Can go into each individual profile via button and will be displayed on separate page.  
Authenticated users can then edit only their own profile (edit button appears). User profile picture appears if they use email which was associated with gravatar, otherwise - default placeholder picture

### Posts page - protected

Upper part - form to create a post with submit button.
Lower part - all created posts are displayed and sorted by newest creation date.
In individual post component - profile picture with name is displayed - can go directly to that users profile, like, unlike buttons functionality, discussion button displays how many comments are to this post and leads into separate comments page. Delete button appears only for users who created that post. If you delete the post all associated comments will be deleted as well.

### Comments page - protected

Similar design to posts. The post text appears above, then form for comment submission and added comments appear below. Can also access user profile if he has created one via picture in the comment.

### Jobs page - public with protected features

User can add a job, if guest clicks on add job button - will be asked to log in first.
Recent 3 jobs are displayed. With View All Jobs button all jobs are loaded. Each job card displays info and individual job can be viewed, edited or deleted on different page via Read More button
