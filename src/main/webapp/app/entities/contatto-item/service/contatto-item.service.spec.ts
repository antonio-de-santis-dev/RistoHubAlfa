import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IContattoItem } from '../contatto-item.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../contatto-item.test-samples';

import { ContattoItemService } from './contatto-item.service';

const requireRestSample: IContattoItem = {
  ...sampleWithRequiredData,
};

describe('ContattoItem Service', () => {
  let service: ContattoItemService;
  let httpMock: HttpTestingController;
  let expectedResult: IContattoItem | IContattoItem[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ContattoItemService);
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

    it('should create a ContattoItem', () => {
      const contattoItem = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(contattoItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ContattoItem', () => {
      const contattoItem = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(contattoItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ContattoItem', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ContattoItem', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ContattoItem', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addContattoItemToCollectionIfMissing', () => {
      it('should add a ContattoItem to an empty array', () => {
        const contattoItem: IContattoItem = sampleWithRequiredData;
        expectedResult = service.addContattoItemToCollectionIfMissing([], contattoItem);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(contattoItem);
      });

      it('should not add a ContattoItem to an array that contains it', () => {
        const contattoItem: IContattoItem = sampleWithRequiredData;
        const contattoItemCollection: IContattoItem[] = [
          {
            ...contattoItem,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addContattoItemToCollectionIfMissing(contattoItemCollection, contattoItem);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ContattoItem to an array that doesn't contain it", () => {
        const contattoItem: IContattoItem = sampleWithRequiredData;
        const contattoItemCollection: IContattoItem[] = [sampleWithPartialData];
        expectedResult = service.addContattoItemToCollectionIfMissing(contattoItemCollection, contattoItem);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(contattoItem);
      });

      it('should add only unique ContattoItem to an array', () => {
        const contattoItemArray: IContattoItem[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const contattoItemCollection: IContattoItem[] = [sampleWithRequiredData];
        expectedResult = service.addContattoItemToCollectionIfMissing(contattoItemCollection, ...contattoItemArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const contattoItem: IContattoItem = sampleWithRequiredData;
        const contattoItem2: IContattoItem = sampleWithPartialData;
        expectedResult = service.addContattoItemToCollectionIfMissing([], contattoItem, contattoItem2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(contattoItem);
        expect(expectedResult).toContain(contattoItem2);
      });

      it('should accept null and undefined values', () => {
        const contattoItem: IContattoItem = sampleWithRequiredData;
        expectedResult = service.addContattoItemToCollectionIfMissing([], null, contattoItem, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(contattoItem);
      });

      it('should return initial array if no ContattoItem is added', () => {
        const contattoItemCollection: IContattoItem[] = [sampleWithRequiredData];
        expectedResult = service.addContattoItemToCollectionIfMissing(contattoItemCollection, undefined, null);
        expect(expectedResult).toEqual(contattoItemCollection);
      });
    });

    describe('compareContattoItem', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareContattoItem(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 13358 };
        const entity2 = null;

        const compareResult1 = service.compareContattoItem(entity1, entity2);
        const compareResult2 = service.compareContattoItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 13358 };
        const entity2 = { id: 26836 };

        const compareResult1 = service.compareContattoItem(entity1, entity2);
        const compareResult2 = service.compareContattoItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 13358 };
        const entity2 = { id: 13358 };

        const compareResult1 = service.compareContattoItem(entity1, entity2);
        const compareResult2 = service.compareContattoItem(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
