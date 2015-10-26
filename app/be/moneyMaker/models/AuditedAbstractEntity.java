package be.moneyMaker.models;

import play.db.ebean.Model;

import javax.persistence.Embedded;
import javax.persistence.MappedSuperclass;

/**
 * Created by florian on 2/09/14.
 */
@MappedSuperclass
public abstract class AuditedAbstractEntity extends Model{

	@Embedded
	protected TechnicalSegment technicalSegment;

	protected AuditedAbstractEntity() {
	}

	public TechnicalSegment getTechnicalSegment() {
		return technicalSegment;
	}

	public void setTechnicalSegment(TechnicalSegment technicalSegment) {
		this.technicalSegment = technicalSegment;
	}

	@Override
	public String toString() {
		return "AuditedAbstractEntity{" +
				"technicalSegment=" + technicalSegment +
				'}';
	}
}
