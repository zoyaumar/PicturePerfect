# PicturePerfect
Beta version will be released in the future.

**Overview**:

If you're struggling to complete your daily tasks or chores, this mobile app is for you -  
PicturePerfect is an accountability app in which users fill in a daily collage of photos to create their Picture Perfect Day. Users can upload one image per each task to help establish a daily habit (maximum of 9 tasks allowed per day).  
Users can then share their completed daily collage with others. This engaging approach helps build habits while allowing friends to glimpse the more ordinary aspects of your day. The more collages you complete, the more badges you'll earn and the longer your streak will grow.  
View the accompanying gif and features section for more clarification.

(For example, if you input "Make the bed" as one of your tasks, you will then need to upload an image or take a picture of you doing that task every day.)
  
<img src="https://github.com/zoyaumar/picture-perfect-app/blob/main/pictureapp.gif" alt="PicturePerfect GIF" width="400"/>

**Features/Usage**:
- **List Tasks**: The app features a task list which can be updated at any time. The number of tasks correlates to the number of sections in the collage grid. 
- **Fill in Your Daily Collage**:
   - The Daily Collage is a grid where each section is designated for a specific task.
   - Users populate their daily collage with images of themselves completing these tasks.
   - Collages are automatically saved to your profile and reset at midnight.
- **Make Your Posts Public**: Collages are automatically saved to a database and posted privately to your account. You can then change the settings of the posts to make it public.
- **See What Your Friends' Days Consist Of**: You can view what others are up to by going on the Feed page.
- **Authentication**: Simple way to sign-up/sign-in and update your profile settings. 
- **Compatible on Android and IOS devices**
  
 **Optimizations**:
 - Daily Collages will automatically be saved and reset at midnight 
 - Have the ability to follow friends and visit their profiles
 - Badges/achievements and Streak feature for those who complete a number of collages.
   
**Technologies**:

**React Native**: Enables a seamless cross-platform experience with reusable components for a native feel on both iOS and Android.  
**TypeScript**: Improves code reliability through static typing, helping to catch errors early.  
**Expo Router**: Simplifies navigation and helps me manage screen transitions effortlessly and ensuring a smooth user experience throughout the app.  
**Supabase**: Powers user management and data storage, providing secure authentication and robust file handling for user-generated content with real-time updates.


## Get started

1. Clone this repository and navigate into its directory.

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo
