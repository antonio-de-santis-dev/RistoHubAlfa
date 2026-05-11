import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IProfiloRistoratore } from '../profilo-ristoratore.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../profilo-ristoratore.test-samples';

import { ProfiloRistoratoreService } from './profilo-ristoratore.service';

const requireRestSample: IProfiloRistoratore = {
  ...sampleWithRequiredData,
};

describe('ProfiloRistoratore Service', () => {
  let service: ProfiloRistoratoreService;
  let httpMock: HttpTestingController;
  let expectedResult: IProfiloRistoratore | IProfiloRistoratore[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ProfiloRistoratoreService);
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

    it('should create a ProfiloRistoratore', () => {
      const profiloRistoratore = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(profiloRistoratore).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProfiloRistoratore', () => {
      const profiloRistoratore = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(profiloRistoratore).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProfiloRistoratore', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProfiloRistoratore', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ProfiloRistoratore', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProfiloRistoratoreToCollectionIfMissing', () => {
      it('should add a ProfiloRistoratore to an empty array', () => {
        const profiloRistoratore: IProfiloRistoratore = sampleWithRequiredData;
        expectedResult = service.addProfiloRistoratoreToCollectionIfMissing([], profiloRistoratore);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(profiloRistoratore);
      });

      it('should not add a ProfiloRistoratore to an array that contains it', () => {
        const profiloRistoratore: IProfiloRistoratore = sampleWithRequiredData;
        const profiloRistoratoreCollection: IProfiloRistoratore[] = [
          {
            ...profiloRistoratore,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProfiloRistoratoreToCollectionIfMissing(profiloRistoratoreCollection, profiloRistoratore);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProfiloRistoratore to an array that doesn't contain it", () => {
        const profiloRistoratore: IProfiloRistoratore = sampleWithRequiredData;
        const profiloRistoratoreCollection: IProfiloRistoratore[] = [sampleWithPartialData];
        expectedResult = service.addProfiloRistoratoreToCollectionIfMissing(profiloRistoratoreCollection, profiloRistoratore);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(profiloRistoratore);
      });

      it('should add only unique ProfiloRistoratore to an array', () => {
        const profiloRistoratoreArray: IProfiloRistoratore[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const profiloRistoratoreCollection: IProfiloRistoratore[] = [sampleWithRequiredData];
        expectedResult = service.addProfiloRistoratoreToCollectionIfMissing(profiloRistoratoreCollection, ...profiloRistoratoreArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const profiloRistoratore: IProfiloRistoratore = sampleWithRequiredData;
        const profiloRistoratore2: IProfiloRistoratore = sampleWithPartialData;
        expectedResult = service.addProfiloRistoratoreToCollectionIfMissing([], profiloRistoratore, profiloRistoratore2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(profiloRistoratore);
        expect(expectedResult).toContain(profiloRistoratore2);
      });

      it('should accept null and undefined values', () => {
        const profiloRistoratore: IProfiloRistoratore = sampleWithRequiredData;
        expectedResult = service.addProfiloRistoratoreToCollectionIfMissing([], null, profiloRistoratore, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(profiloRistoratore);
      });

      it('should return initial array if no ProfiloRistoratore is added', () => {
        const profiloRistoratoreCollection: IProfiloRistoratore[] = [sampleWithRequiredData];
        expectedResult = service.addProfiloRistoratoreToCollectionIfMissing(profiloRistoratoreCollection, undefined, null);
        expect(expectedResult).toEqual(profiloRistoratoreCollection);
      });
    });

    describe('compareProfiloRistoratore', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProfiloRistoratore(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 30942 };
        const entity2 = null;

        const compareResult1 = service.compareProfiloRistoratore(entity1, entity2);
        const compareResult2 = service.compareProfiloRistoratore(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 30942 };
        const entity2 = { id: 30431 };

        const compareResult1 = service.compareProfiloRistoratore(entity1, entity2);
        const compareResult2 = service.compareProfiloRistoratore(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 30942 };
        const entity2 = { id: 30942 };

        const compareResult1 = service.compareProfiloRistoratore(entity1, entity2);
        const compareResult2 = service.compareProfiloRistoratore(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
