import { CompareService } from './compare.service';
import { FinalResult } from '../enums';

describe('CompareService', () => {
    let service: CompareService;

    beforeEach(() => {
        service = new CompareService();
    });

    describe('compare', () => {
        it('should check highcard beats higher highcard', () => {
            const result = service.compare('AD 5H 3D 8S 9H', '4S 5S 2D QD JH');
            expect(result).toEqual(FinalResult.Loss);
        });

        it('should check straight beats higher straight', () => {
            const result = service.compare('5S 6D 9D 7H 8H', '7D 8S TS JS 9H');
            expect(result).toEqual(FinalResult.Win);
        });

        it('should check pair beats higher pair', () => {
            const result = service.compare('QD QH 3D 8S 9H', '5S 5D 2D AH JH');
            expect(result).toEqual(FinalResult.Loss);
        });

        it('should check full house beats higher full house', () => {
            const result = service.compare('QD QH QC 8S 8H', 'AS AD 6D 6H 6C');
            expect(result).toEqual(FinalResult.Loss);
        });

        it('should check tie between highcards', () => {
            const result = service.compare('AD 5H 3D 8S 9H', '4S 7S 2D AH JH');
            expect(result).toEqual(FinalResult.Tie);

            const result2 = service.compare('4H 6H 7C AS TC', 'KH 9S AH 2C JD');
            expect(result2).toEqual(FinalResult.Tie);
        });

        it('should check tie between pairs', () => {
            const result = service.compare('AD AH 3D 8S 9H', '4S 5S 2D AS AH');
            expect(result).toEqual(FinalResult.Tie);
        });

        it('should check pair beats three of a kind', () => {
            const result = service.compare('TS 3C 5D 3D 4H', 'KD 2H KC KH 7D');
            expect(result).toEqual(FinalResult.Win);
        });

        it('should check highcard beats pair', () => {
            const result = service.compare('KD 5H 3D 8S 9H', '4S 5S 4D AH JH');
            expect(result).toEqual(FinalResult.Win);

            const result2 = service.compare('TS 5S TD AH JH', 'KD 5H 3D 8S 9H');
            expect(result2).toEqual(FinalResult.Loss);
        });

        it('should check highcard beats two pairs', () => {
            const result = service.compare('KD 5H 3D 8S 9H', '4S 5S 4D 5D JH');
            expect(result).toEqual(FinalResult.Win);
        });

        it('should check highcard beats three of a kind', () => {
            const result = service.compare('KD 5H 3D 8S 9H', '4S 5S 4D 5D JH');
            expect(result).toEqual(FinalResult.Win);

            const result2 = service.compare('QD QH QS 8S 9H', 'TD 5H 3D 8D 9S');
            expect(result2).toEqual(FinalResult.Loss);
        });

        it('should check highcard beats straight', () => {
            const result = service.compare('5S 6D 9D 7H 8H', 'TD 5H 3D 8D 9S');
            expect(result).toEqual(FinalResult.Loss);
        });

        it('should check highcard beats flush', () => {
            const result = service.compare('KS TS 6S 7S 4S', 'TD 5H 3D 8D 9S');
            expect(result).toEqual(FinalResult.Loss);
        });

        it('should check highcard beats full house', () => {
            const result = service.compare('QD QH QS 6S 6H', 'TD 5H 3D 8D 9S');
            expect(result).toEqual(FinalResult.Loss);
        });

        it('should check highcard beats four of a kind', () => {
            const result = service.compare('QD QH QS QC 6H', 'TD 5H 3D 8D 9S');
            expect(result).toEqual(FinalResult.Loss);
        });

        it('should check highcard beats straight flush', () => {
            const result = service.compare('2S 4S 3S 6S 5S', 'TD 5H 3D 8D 9S');
            expect(result).toEqual(FinalResult.Loss);
        });

        it('should check highcard beats royal flush', () => {
            const result = service.compare('AS TS KS JS QS', 'TD 5H 3D 8D 9S');
            expect(result).toEqual(FinalResult.Loss);
        });

        it('should check straight beats three of a kind', () => {
            const result = service.compare('5S 6D 9D 7H 8H', 'QD QH QS 8S 9H');
            expect(result).toEqual(FinalResult.Loss);
        });

        it('should check for invalid cards', () => {
            const result = service.compare('KK TS 6S 7S 4S', 'TD 5H 3D 8D 9S');
            expect(result).toEqual(FinalResult.Invalid);

            const result2 = service.compare('1S TS 6S 7S 4S', 'TD 5H 3D 8D 9S');
            expect(result2).toEqual(FinalResult.Invalid);
        });
    });
});
