import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ITraduzioneMenu } from '../traduzione-menu.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../traduzione-menu.test-samples';

import { TraduzioneMenuService } from './traduzione-menu.service';

const requireRestSample: ITraduzioneMenu = {
  ...sampleWithRequiredData,
};

describe('TraduzioneMenu Service', () => {
  let service: TraduzioneMenuService;
  let httpMock: HttpTestingController;
  let expectedResult: ITraduzioneMenu | ITraduzioneMenu[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(TraduzioneMenuService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a TraduzioneMenu', () => {
      const traduzioneMenu = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(traduzioneMenu).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TraduzioneMenu', () => {
      const traduzioneMenu = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(traduzioneMenu).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TraduzioneMenu', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TraduzioneMenu', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TraduzioneMenu', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTraduzioneMenuToCollectionIfMissing', () => {
      it('should add a TraduzioneMenu to an empty array', () => {
        const traduzioneMenu: ITraduzioneMenu = sampleWithRequiredData;
        expectedResult = service.addTraduzioneMenuToCollectionIfMissing([], traduzioneMenu);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(traduzioneMenu);
      });

      it('should not add a TraduzioneMenu to an array that contains it', () => {
        const traduzioneMenu: ITraduzioneMenu = sampleWithRequiredData;
        const traduzioneMenuCollection: ITraduzioneMenu[] = [
          {
            ...traduzioneMenu,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTraduzioneMenuToCollectionIfMissing(traduzioneMenuCollection, traduzioneMenu);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TraduzioneMenu to an array that doesn't contain it", () => {
        const traduzioneMenu: ITraduzioneMenu = sampleWithRequiredData;
        const traduzioneMenuCollection: ITraduzioneMenu[] = [sampleWithPartialData];
        expectedResult = service.addTraduzioneMenuToCollectionIfMissing(traduzioneMenuCollection, traduzioneMenu);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(traduzioneMenu);
      });

      it('should add only unique TraduzioneMenu to an array', () => {
        const traduzioneMenuArray: ITraduzioneMenu[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const traduzioneMenuCollection: ITraduzioneMenu[] = [sampleWithRequiredData];
        expectedResult = service.addTraduzioneMenuToCollectionIfMissing(traduzioneMenuCollection, ...traduzioneMenuArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const traduzioneMenu: ITraduzioneMenu = sampleWithRequiredData;
        const traduzioneMenu2: ITraduzioneMenu = sampleWithPartialData;
        expectedResult = service.addTraduzioneMenuToCollectionIfMissing([], traduzioneMenu, traduzioneMenu2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(traduzioneMenu);
        expect(expectedResult).toContain(traduzioneMenu2);
      });

      it('should accept null and undefined values', () => {
        const traduzioneMenu: ITraduzioneMenu = sampleWithRequiredData;
        expectedResult = service.addTraduzioneMenuToCollectionIfMissing([], null, traduzioneMenu, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(traduzioneMenu);
      });

      it('should return initial array if no TraduzioneMenu is added', () => {
        const traduzioneMenuCollection: ITraduzioneMenu[] = [sampleWithRequiredData];
        expectedResult = service.addTraduzioneMenuToCollectionIfMissing(traduzioneMenuCollection, undefined, null);
        expect(expectedResult).toEqual(traduzioneMenuCollection);
      });
    });

    describe('compareTraduzioneMenu', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTraduzioneMenu(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 20490 };
        const entity2 = null;

        const compareResult1 = service.compareTraduzioneMenu(entity1, entity2);
        const compareResult2 = service.compareTraduzioneMenu(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 20490 };
        const entity2 = { id: 12885 };

        const compareResult1 = service.compareTraduzioneMenu(entity1, entity2);
        const compareResult2 = service.compareTraduzioneMenu(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 20490 };
        const entity2 = { id: 20490 };

        const compareResult1 = service.compareTraduzioneMenu(entity1, entity2);
        const compareResult2 = service.compareTraduzioneMenu(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
