import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedComponent } from './speed.component';
import { RenderService } from '../../render-service/render.service';
import { CameraService } from '../../camera.service';
import { SkyboxService } from '../../skybox.service';
import { EndGameService } from '../../end-game/end-game.service';
import { BestTimeHandlerService } from '../../recordedTimes/best-time-handler.service';
import { RaceResultsService } from '../../recordedTimes/race-results.service';
import { TrackLoaderService } from '../../track-loader.service';
import { SceneLoaderService } from '../../scene-loader/scene-loader.service';
import { SceneLightsService } from '../../scene-lights/scene-lights.service';
import { AudioService } from '../../audio/audio.service';
import { CarHandlerService } from '../../cars/car-handler.service';

describe('SpeedComponent', () => {
    let component: SpeedComponent;
    let fixture: ComponentFixture<SpeedComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SpeedComponent],
            providers: [RenderService, CameraService, SkyboxService, EndGameService, BestTimeHandlerService, RaceResultsService,
                        TrackLoaderService, SceneLoaderService, SceneLightsService, AudioService, CarHandlerService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SpeedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
