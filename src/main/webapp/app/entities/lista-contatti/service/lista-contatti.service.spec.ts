import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IListaContatti } from '../lista-contatti.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../lista-contatti.test-samples';

import { ListaContattiService } from './lista-contatti.service';

const requireRestSample: IListaContatti = {
  ...sampleWithRequiredData,
};

describe('ListaContatti Service', () => {
  let service: ListaContattiService;
  let httpMock: HttpTestingController;
  let expectedResult: IListaContatti | IListaContatti[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ListaContattiService);
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

    it('should create a ListaContatti', () => {
      const listaContatti = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(listaContatti).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ListaContatti', () => {
      const listaContatti = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(listaContatti).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ListaContatti', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ListaContatti', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ListaContatti', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addListaContattiToCollectionIfMissing', () => {
      it('should add a ListaContatti to an empty array', () => {
        const listaContatti: IListaContatti = sampleWithRequiredData;
        expectedResult = service.addListaContattiToCollectionIfMissing([], listaContatti);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(listaContatti);
      });

      it('should not add a ListaContatti to an array that contains it', () => {
        const listaContatti: IListaContatti = sampleWithRequiredData;
        const listaContattiCollection: IListaContatti[] = [
          {
            ...listaContatti,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addListaContattiToCollectionIfMissing(listaContattiCollection, listaContatti);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ListaContatti to an array that doesn't contain it", () => {
        const listaContatti: IListaContatti = sampleWithRequiredData;
        const listaContattiCollection: IListaContatti[] = [sampleWithPartialData];
        expectedResult = service.addListaContattiToCollectionIfMissing(listaContattiCollection, listaContatti);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(listaContatti);
      });

      it('should add only unique ListaContatti to an array', () => {
        const listaContattiArray: IListaContatti[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const listaContattiCollection: IListaContatti[] = [sampleWithRequiredData];
        expectedResult = service.addListaContattiToCollectionIfMissing(listaContattiCollection, ...listaContattiArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const listaContatti: IListaContatti = sampleWithRequiredData;
        const listaContatti2: IListaContatti = sampleWithPartialData;
        expectedResult = service.addListaContattiToCollectionIfMissing([], listaContatti, listaContatti2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(listaContatti);
        expect(expectedResult).toContain(listaContatti2);
      });

      it('should accept null and undefined values', () => {
        const listaContatti: IListaContatti = sampleWithRequiredData;
        expectedResult = service.addListaContattiToCollectionIfMissing([], null, listaContatti, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(listaContatti);
      });

      it('should return initial array if no ListaContatti is added', () => {
        const listaContattiCollection: IListaContatti[] = [sampleWithRequiredData];
        expectedResult = service.addListaContattiToCollectionIfMissing(listaContattiCollection, undefined, null);
        expect(expectedResult).toEqual(listaContattiCollection);
      });
    });

    describe('compareListaContatti', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareListaContatti(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 9791 };
        const entity2 = null;

        const compareResult1 = service.compareListaContatti(entity1, entity2);
        const compareResult2 = service.compareListaContatti(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 9791 };
        const entity2 = { id: 13574 };

        const compareResult1 = service.compareListaContatti(entity1, entity2);
        const compareResult2 = service.compareListaContatti(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 9791 };
        const entity2 = { id: 9791 };

        const compareResult1 = service.compareListaContatti(entity1, entity2);
        const compareResult2 = service.compareListaContatti(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
