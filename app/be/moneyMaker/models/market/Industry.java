package be.moneyMaker.models.market;


import be.moneyMaker.models.AuditedAbstractEntity;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.*;

/**
 * Created by florian on 13/09/14.
 */
@Entity
@NamedQueries({
		@NamedQuery(name = Industry.FIND_BY_SECTOR, query = "where sector.id = :sectorId"),
})
public class Industry extends AuditedAbstractEntity{

	public static final String FIND_BY_SECTOR = "INDUSTRY_FIND_BY_SECTOR";
	@Id
	private Long id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false, unique = true)
	private Integer reference;

	@Column(nullable = false)
	@ManyToOne(cascade = {CascadeType.MERGE})
	private Sector sector;

	public Industry() {
	}

	public Industry(String name, Integer reference, Sector sector) {
		this.name = name;
		this.reference = reference;
		this.sector = sector;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getReference() {
		return reference;
	}

	public void setReference(Integer reference) {
		this.reference = reference;
	}

	public Sector getSector() {
		return sector;
	}

	public void setSector(Sector sector) {
		this.sector = sector;
	}

	@Override
	public String toString() {
		return "Industry{" +
				"id=" + id +
				", name='" + name + '\'' +
				", reference=" + reference +
				", sector=" + sector +
				'}';
	}
}
