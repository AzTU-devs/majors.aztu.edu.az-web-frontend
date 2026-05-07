import Home from "./pages/Dashboard/Home";
import AppLayout from "./layout/AppLayout";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import UserProfiles from "./pages/UserProfiles";
import NewTlo from "./components/newTlo/NewTlo";
import NotFound from "./pages/OtherPage/NotFound";

import NewGcoPage from "./pages/NewGcoPage/NewGcoPage";
import NewPloPage from "./pages/NewPloPage/NewPloPage";
import NewSloPage from "./pages/NewSloPage/NewSloPage";
import TopicsPage from "./pages/TopicsPage/TopicsPage";
import NewCloPage from "./pages/NewCloPage/NewCloPage";
import SubjectsPage from "./pages/SubjectsPage/SubjectsPage";
import NewTopicPage from "./pages/NewTopicPage/NewTopicPage";
import RequireAuth from "./components/auth/RequireAuth";
import { ScrollToTop } from "./components/common/ScrollToTop";
import NewSubjectPage from "./pages/NewSubjectPage/NewSubjectPage";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import NewSpecCharPage from "./pages/NewSpecCharPage/NewSpecCharPage";
import SpecialtiesPage from "./pages/SpecialtiesPage/SpecialtiesPage";
import FacultiesPage from "./pages/FacultiesPage/FacultiesPage";
import CafedrasPage from "./pages/CafedrasPage/CafedrasPage";
import LiteraturesPage from "./pages/LiteraturesPage/LiteraturesPage";
import SubjectDetailsPage from "./pages/SubjectDetailsPage/SubjectDetailsPage";
import NewSpecialtyPage from "./pages/NewSpecialtyPage/NewSpecialtyPage";
import TopicDetailsPage from "./pages/TopicDetailsPage/TopicDetailsPage";
import NewLiteraturePage from "./pages/NewLiteraturePage/NewLiteraturePage";
import NewCompetencyPage from "./pages/NewCompetencyPage/NewCompetencyPage";
import SpecialtyDetailsPage from "./pages/SpecialtyDetails/SpecialtyDetails";
import SubjectsSillabusPage from "./pages/SubjectSillabusPage/SubjectSillabusPage";
import SubjectMatchingTablePage from "./pages/SubjectMatchingTablePage/SubjectMatchingTablePage";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />

            {/* Faculties */}
            <Route path="/faculties" element={<FacultiesPage />} />

            {/* Cafedras */}
            <Route path="/cafedras" element={<CafedrasPage />} />

            {/* Specialties */}
            <Route path="/specialties" element={<SpecialtiesPage />} />
            <Route path="/specialty-details" element={<SpecialtyDetailsPage />} />
            <Route path="/new-specialty" element={<NewSpecialtyPage />} />

            {/* Specialty characteristics */}
            <Route path="/specialty-details/new-specialty-characteristics" element={<NewSpecCharPage />} />

            {/* Curriculum details */}
            {/* <Route path="/specialty-details/curriculum" element={<CurriculumDetailsPage />} /> */}

            {/* Subjects */}
            <Route path="/specialty-details/subjects" element={<SubjectsPage />} />
            <Route path="/specialty-details/subjects/new" element={<NewSubjectPage />} />
            <Route path="/specialty-details/subjects/subject-details" element={<SubjectDetailsPage />} />
            <Route path="/specialty-details/subjects/subject-matching-table" element={<SubjectMatchingTablePage />} />
            <Route path="/specialty-details/subjects/subject-details/sillabus" element={<SubjectsSillabusPage />} />

            {/* Topics */}
            <Route path="/specialty-details/subjects/topics" element={<TopicsPage />} />
            <Route path="/specialty-details/subjects/topics/new" element={<NewTopicPage />} />
            <Route path="/specialty-details/subjects/topics/details" element={<TopicDetailsPage />} />
            <Route path="/specialty-details/subjects/topics/new-tlo" element={<NewTlo />} />

            {/* Program Learning Outcomes (PLO) */}
            <Route path="/specialty-details/new-plo" element={<NewPloPage />} />

            {/* Student Learning Outcomes (SLO) */}
            <Route path="/specialty-details/new-slo" element={<NewSloPage />} />

            {/* Graduate Career Opportunities (GCO) */}
            <Route path="/specialty-details/new-gco" element={<NewGcoPage />} />

            {/* Course Learning Outcomes (CLO) */}
            <Route path="/specialty-details/subjects/subject-details/new-clo" element={<NewCloPage />} />

            {/* Competency */}
            <Route path="/specialty-details/new-competency" element={<NewCompetencyPage />} />

            {/* Literatures */}
            <Route path="/literatures" element={<LiteraturesPage />} />
            <Route path="/new-literature" element={<NewLiteraturePage />} />

          </Route>
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
