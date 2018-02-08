import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameUiComponent } from './game-ui.component';
import { InformationsComponent } from '../informations/informations.component';
import { GridComponent } from '../grid/grid.component';
import { DefinitionsComponent } from '../definitions/definitions.component';

describe('GameUiComponent', () => {
    let component: GameUiComponent;
    let fixture: ComponentFixture<GameUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [
            GameUiComponent,
            InformationsComponent,
            GridComponent,
            DefinitionsComponent
         ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GameUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
