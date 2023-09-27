describe("Home Page", () => {

    beforeEach(() => {

        cy.fixture("courses.json").as("coursesJSON");

        cy.server();

        cy.route("/api/courses", "@coursesJSON").as("courses");

        cy.visit('/'); // go to the root of the app
    });

    it("should display a list of courses", () => {
        cy.contains("All Courses"); // check the title

        cy.wait("@courses");

        cy.get("mat-card").should("have.length", 9);
    });

    it("should display the advanced courses", () => {
        // assert beginners and advanced courses tabs

        cy.get(".mdc-tab").should("have.length", 2); // check tab buttons
        
        cy.get(".mdc-tab").last().click(); // click advanced button

        cy.get(".mat-mdc-tab-body-active .mat-mdc-card-title").its("length").should("be.gt", 1); // get the list of titles > 1

        cy.get(".mat-mdc-tab-body-active .mat-mdc-card-title").first()
            .should("contain", "Angular Security Course"); // check the first title
    });
});