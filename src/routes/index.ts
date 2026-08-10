import { Router } from "express";
import auth from "./auth.route";
import users from "./users.route";
import categories from "./categories.route";
import companies from "./companies.route";
import jobs from "./jobs.route";
import applications from "./applications.route";
import savedJobs from "./saved-jobs.route";
import reviews from "./reviews.route";

const router = Router();

router.get("/", (req, res) => {
  res.json({ success: true, message: "Welcome to HireFlow API v1" });
});

router.use("/auth", auth);
router.use("/users", users);
router.use("/categories", categories);
router.use("/companies", companies);
router.use("/jobs", jobs);
router.use("/applications", applications);
router.use("/saved-jobs", savedJobs);
router.use("/reviews", reviews);

export default router;