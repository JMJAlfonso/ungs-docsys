import Login from '../pages/Auth/login/login';
import SignUp from '../pages/Auth/signup/SignUp';
import ForgotPassword from '../pages/Auth/forgotPass/forgotPass';
import SetNewPass from '../pages/Auth/setNewPass/setNewPass';
import JobAppList from '../pages/jobAppMng/jobAppList/JobAppList';
import CreateJobApp from '../pages/jobAppMng/createJobApp/CreateJobApp'; 
import ViewJobApp from '../pages/jobAppMng/viewJobApp/ViewJobApp';
import ViewResume from '../pages/resumeMng/viewResume/ViewResume';
import LoadResume from '../pages/resumeMng/loadResume/LoadResume';
import ResumeForm from '../pages/Resume/ResumeForm';
import JobApplicationResumeManagment from '../pages/JobApplicationResumeManagment/job-application-resume-managment';
import Users from '../pages/Users/Users';

const RECRUITER_ROLE = "RECRUITER";
const CANDIDATE_ROLE = "CANDIDATE";
const ADMIN_ROLE = "ADMIN";

export const routes = [
    {
      path: "/",
      element: <Login />
    },
    {
      path: "/signUp",
      element:<SignUp />
    },
    {
      path: "forgotPass",
      element: <ForgotPassword />
    },
    {
      path: "setNewPass",
      element: <SetNewPass />
    },
    {
      path: "jobAppList",
      element: <JobAppList />,
      requiredRoles: [RECRUITER_ROLE, CANDIDATE_ROLE, ADMIN_ROLE]
    },
    {
      path: "app-job-detail",
      element: <CreateJobApp />,
      requiredRoles: [RECRUITER_ROLE, ADMIN_ROLE]
    },
    {
      path: "viewJobApp/:id",
      element: <ViewJobApp />,
      requiredRoles: [RECRUITER_ROLE, CANDIDATE_ROLE, ADMIN_ROLE]
    },
    {
      path: "loadResume",
      element: <LoadResume />
    },
    {
      path: "resume",
      element: <ResumeForm />,
      requiredRoles: [CANDIDATE_ROLE, ADMIN_ROLE]
    },
    {
      path: "resume/:resumeUserId",
      element: <ResumeForm />,
      requiredRoles: [RECRUITER_ROLE, ADMIN_ROLE]
    },
    {
      path: "job-application-resume-managment/:jobApplicationId",
      element: <JobApplicationResumeManagment />
    },
    {
      path: "users",
      element: <Users />,
      requiredRoles: [ADMIN_ROLE]
    }
];