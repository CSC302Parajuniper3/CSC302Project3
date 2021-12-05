# A2 Blameless Post-mortem:

- What goals have been achieved?
  - A github repo is created with our team members for the project
  - We have a node project that is runnable and has a simple test suite
  - Dependencies should be ready to install in one command
  - Running the project takes only one command after dependencies are built
  - Running test suites takes only one command after dependencies are built
  - Project functionality and test coverage is not required for this milestone
  - The project is containerized in Docker
  - Project is hosted on Heroku, deployed with our docker image
    - A readme is provided in top level directory of the repo with instructions on installing and running the project
    - A summary of our tech stack and the relevant decision making
    - Milestones of the project with member ownership of each step
    - Directions to our collection of meeting notes

- Why did it go right?
  - Had clear responsibilities, which were assigned early
  - We kept records of meeting notes
  - Scope was relatively small, and didn't overestimate capacity
  - Team members helped each other when facing difficulty
  - Each part of the process had a team member that was familiar with it

---

- What goals have been missed, and by how much?
  - All of our original goals were met

- What could improve?
  - We crammed meetings towards the end, we will change to have weekly meetings
  - Meetings were not structured well, we will make sure we're prepared before the meeting starts

---

- What, if any, adjustments or decisions need to be made in light of what we have learned about project scope and capacity, in particular what plans will need to be adjusted, based on remaining time available and project scope?
  - We will have to version the application when we update or delete guideline records, which is a feature our partner informed us about after deciding the initial milestones
    - We don't think this will significantly change our scope or introduce any risks to our project

- What goals have been achieved.
  - Create db/schema and populate our downloaded guideline definitions
  - We should be able to read a list of all guidelines
  - We should be able to retrieve a specific guideline
  - We should be able to add a new guideline to the db
  - We should additionally verify the above functionality using manual testing with Postman
  - The product for milestone 2 achieved the acceptance criteria of all of the above.
- What goals have been missed, and by how much.
  - None.
- How plans were adjusted, in light of that information, including goals or features that
were dropped.
  - Our plans did not change due to the achieved/missed goals.
  - We completed all of our goals in the milestone.
  - We obtained new information about updating (change the version of record) and deleting (do a soft delete only) from the database.
  - Didn’t affect our plans, we just updated tasks/acceptance criteria to include these facts.
  - May need to update schema to implement these changes (ex. Adding a “deleted” property).
  - We should be able to get the activity definition referenced by a plan definition
  - Added a new goal to create this endpoint and unit tests.
  - Marked as a stretch goal, because the information could also be retrieved from existing “get plan” endpoint.
  - Reviewed acceptance criteria with Alex, and found some acceptance criteria to be lacking.
  - Updated acceptance criteria to be more specific (ex. Specified number of corner cases to add).

---

