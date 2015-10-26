package be.moneyMaker.models.market;

import be.moneyMaker.models.AuditedAbstractEntity;
import tyrex.util.ArraySet;

import javax.persistence.*;
import java.util.Set;

/**
 * Created by florian on 14/09/14.
 */
@Entity
public class Sector extends AuditedAbstractEntity {

	@Id
	private Long id;

	@Column(nullable = false, unique = true)
	private String name;

	@OneToMany(cascade = CascadeType.ALL, mappedBy = "sector")
	private Set<Industry> industries;

	public Sector() {
	}

	public Sector(String name) {
		this.name = name;
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

	public Set<Industry> getIndustries() {
		return industries;
	}

	public void setIndustries(Set<Industry> industries) {
		this.industries = industries;
	}

	@Override
	public String toString() {
		return "Sector{" +
				"id=" + id +
				", name='" + name + '\'' +
				", industries=" + industries +
				'}';
	}

	public void addIndustry(Industry industry) {
		if (this.industries == null) {
			this.industries = new ArraySet();
		}
		this.industries.add(industry);
	}
}
