import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HomepageComponent } from "./homepage.component";
import { GameStateService } from "../crossword-game/game-state.service";

describe("HomepageComponent", () => {
    let component: HomepageComponent;
    let fixture: ComponentFixture<HomepageComponent>;

    beforeEach(async(() => {
        // tslint:disable-next-line:no-floating-promises
        TestBed.configureTestingModule({
            declarations: [HomepageComponent],
            providers: [GameStateService]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomepageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
