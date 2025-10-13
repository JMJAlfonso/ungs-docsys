import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'ExperienceDateRangeValidator', async: false })
export class ExperienceDateRangeValidator implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    const start = new Date(obj.startDate);
    const end = obj.endDate ? new Date(obj.endDate) : null;
    const today = new Date();

    if (start > today) return false; // No puede empezar en el futuro
    if (end && end > today) return false; // No puede terminar en el futuro
    if (end && start > end) return false; // Inicio > fin

    return true;
  }

  defaultMessage() {
    return 'Las fechas de experiencia laboral no son coherentes o están en el futuro.';
  }
}
